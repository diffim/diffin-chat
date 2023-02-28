import { Avatar, Skeleton } from "@mui/material";
import { useRef } from "react";
import ChatHeader from "./ChatHeader";
import ChatFooter from "./ChatFooter";
import { firebaseDb } from "../firebase";
import useSendGlobalMessage from "../custom-hooks/useSendGlobalMessage";
import { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";
import useHandleShortcut from "../custom-hooks/useHandleShortcut";
import Message from "./ui/Message";

function Chat() {
  const messagesRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const urlImageInputRef = useRef<HTMLInputElement>(null);

  //choosig to use a ref for the input cuz it state got really laggy really fast

  const {
    messages,
    messagesLoading,
    userLoading,
    sendPost,
    user,
    clearValueOfRef,
    onFileChange,
  } = useSendGlobalMessage({
    containerRefValue: messagesRef,
    collectionName: "globalMessages",
    inputRef: inputRef,
    fileInputRef: fileInputRef,
    urlImageInputRef: urlImageInputRef,
  });

  const chatHTML = messagesRef.current;

  const [] = useHandleShortcut({
    userAction: "Escape",
    actionFunction: scrollToBottom,
    useCtrlKey: false,
    useEffectDependency: messagesLoading,
  });

  function deleteMessage(docID: string) {
    firebaseDb
      .collection("globalMessages")
      .doc(docID)
      .delete()
      .catch((error) => {
        console.error("Error removing document: ", error);
      });
  }

  function scrollToBottom() {
    chatHTML!.scrollTop = chatHTML!.scrollHeight;
  }

  const skeletonArray = new Array(20).fill(1);
  const loadingPlaceholder = skeletonArray.map((skeleton, index) => (
    <div className="mt-5 flex" key={index}>
      <Skeleton
        variant="circular"
        width={45}
        height={45}
        className="mr-5 !bg-zinc-200 dark:!bg-zinc-700 "
      />
      <div className="flex flex-col">
        <Skeleton
          variant="text"
          sx={{
            fontSize: "1.2rem",
            width: "100px",
          }}
          className="!bg-zinc-200 dark:!bg-zinc-700"
        />
        <Skeleton
          variant="rounded"
          sx={{
            width: "200px",
            height: "35px",
            marginTop: "12px",
          }}
          className="!bg-zinc-200 dark:!bg-zinc-700"
        />
        <Skeleton
          variant="rounded"
          sx={{
            width: "200px",
            height: "35px",
            marginTop: "12px",
          }}
          className="!bg-zinc-200 dark:!bg-zinc-700"
        />
        <Skeleton
          variant="rounded"
          sx={{
            width: "200px",
            height: "35px",
            marginTop: "12px",
          }}
          className="!bg-zinc-200 dark:!bg-zinc-700"
        />
      </div>
    </div>
  ));

  const messageListJsx = messages?.docs.map(
    (message: QueryDocumentSnapshot<DocumentData>, index: number) => {
      return (
        <div className="mt-4  flex " key={message.id}>
          {message.data().usersID ===
          messages?.docs[index - 1]?.data().usersID ? (
            <></>
          ) : (
            <Avatar
              src={message.data().profilePic}
              className="col-span-full mr-4  !h-10 !w-10"
            />
          )}

          <div className="flex flex-col">
            {message.data().usersID ===
            messages?.docs[index - 1]?.data().usersID ? (
              <Message
                message={message}
                user={user}
                deleteMessage={deleteMessage}
                showImage={!(message.data().messageImg === "" || undefined)}
              />
            ) : (
              <>
                <p>{message.data().name} </p>
                <Message
                  message={message}
                  user={user}
                  deleteMessage={deleteMessage}
                  messageBelowName={true}
                  showImage={!(message.data().messageImg === "" || undefined)}
                />
              </>
            )}
          </div>
        </div>
      );
    }
  );

  return (
    <div
      ref={messagesRef}
      className="chat__container overflow-overlay   relative  col-span-1   scroll-smooth   dark:bg-zinc-800 "
    >
      <ChatHeader />
      {/* this is where the messages  go */}
      {/* weird 84% is so the input always stays at the bottom */}
      <div className="overflow min-h-[83%] p-1 px-6 dark:bg-zinc-800  ">
        {messagesLoading || userLoading ? loadingPlaceholder : messageListJsx}
      </div>
      <ChatFooter
        inputRef={inputRef}
        sendPost={sendPost}
        clearValueOfRef={clearValueOfRef}
        imageInputRef={urlImageInputRef}
        fileInputRef={fileInputRef}
        onFileChange={onFileChange}
      />
    </div>
  );
}

export default Chat;
