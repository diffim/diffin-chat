import { Avatar, IconButton, Skeleton } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import ChatHeader from "./ChatHeader";
import ChatFooter from "./ChatFooter";
import { firebaseAuth, firebaseDb, firebase } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import { useLocation } from "react-router-dom";
import useSendGlobalMessage from "../custom-hooks/useSendGlobalMessage";
import { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";
import useHandleShortcut from "../custom-hooks/useHandleShortcut";
import { Delete, DeleteOutline } from "@mui/icons-material";
import { doc, deleteDoc } from "firebase/firestore";

function Chat() {
  const messagesRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  //choosig to use a ref for the input cuz it state got really laggy really fast

  const { messages, messagesLoading, userLoading, sendPost, user } =
    useSendGlobalMessage({
      containerRefValue: messagesRef,
      collectionName: "globalMessages",
      inputRef: inputRef,
    });

  const chatHTML = messagesRef.current;

  const [] = useHandleShortcut({
    userAction: "Escape",
    actionFunction: scrollToBottom,
    useCtrlKey: false,
    useEffectDependency: messagesLoading,
  });

  function deleteMessage(docID: string) {
    console.log(docID);
    firebaseDb
      .collection("globalMessages")
      .doc(docID)
      .delete()
      .then(() => {
        console.log("Document successfully deleted!");
      })
      .catch((error) => {
        console.error("Error removing document: ", error);
      });
  }

  function scrollToBottom() {
    chatHTML!.scrollTop = chatHTML!.scrollHeight;
  }

  const skeletonArray = new Array(20).fill(1);
  const loadingPlaceholder = skeletonArray.map((skeleton, index) => (
    <div className="flex mt-5" key={index}>
      <Skeleton
        variant="circular"
        width={45}
        height={45}
        className="mr-5 dark:!bg-zinc-700 !bg-zinc-200 "
      />
      <div className="flex-col flex">
        <Skeleton
          variant="text"
          sx={{
            fontSize: "1.2rem",
            width: "100px",
          }}
          className="dark:!bg-zinc-700 !bg-zinc-200"
        />
        <Skeleton
          variant="rounded"
          sx={{
            width: "200px",
            height: "35px",
            marginTop: "12px",
          }}
          className="dark:!bg-zinc-700 !bg-zinc-200"
        />
        <Skeleton
          variant="rounded"
          sx={{
            width: "200px",
            height: "35px",
            marginTop: "12px",
          }}
          className="dark:!bg-zinc-700 !bg-zinc-200"
        />
        <Skeleton
          variant="rounded"
          sx={{
            width: "200px",
            height: "35px",
            marginTop: "12px",
          }}
          className="dark:!bg-zinc-700 !bg-zinc-200"
        />
      </div>
    </div>
  ));

  const messageListJsx = messages?.docs.map(
    (message: QueryDocumentSnapshot<DocumentData>, index: number) => {
      return (
        <div className="mt-4  flex " key={message.id}>
          {message.data().profilePic ===
          messages?.docs[index - 1]?.data().profilePic ? (
            <></>
          ) : (
            <Avatar
              src={message.data().profilePic}
              className="!w-10 !h-10  mr-4 col-span-full"
            />
          )}

          <div className="flex-col flex">
            {message.data().name === messages?.docs[index - 1]?.data().name ? (
              <div className=" group flex items-center gap-3">
                <div className="dark:bg-zinc-700/40   items-center flex  bg-zinc-200 h-auto ml-[55px] max-w-[1200px] break-all rounded-md p-4">
                  <p>{message.data().message}</p>
                </div>
                {message.data().usersID === user?.uid && (
                  <div
                    onClick={() => deleteMessage(message.id)}
                    className="group-hover:opacity-100 active:scale-95   opacity-0 transition-opacity"
                  >
                    <IconButton>
                      <DeleteOutline />
                    </IconButton>{" "}
                  </div>
                )}
              </div>
            ) : (
              <>
                <p>{message.data().name} </p>
                <div className=" group flex items-center gap-3">
                  <div
                    className="dark:bg-zinc-700/40 group items-center flex relative bg-zinc-200 mt-3 max-w-[1200px]
               break-all mr-1  rounded-md p-4"
                  >
                    <p>{message.data().message}</p>
                  </div>

                  {message.data().usersID === user?.uid && (
                    <div
                      onClick={() => deleteMessage(message.id)}
                      className="group-hover:opacity-100  active:scale-95 mt-2   opacity-0 transition-opacity"
                    >
                      <IconButton>
                        <DeleteOutline />
                      </IconButton>
                    </div>
                  )}
                </div>
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
      className="chat__container scroll-smooth   relative  dark:bg-zinc-800   overflow-overlay   col-span-1 "
    >
      <ChatHeader />
      {/* this is where the messages  go */}
      {/* weird 84% is so the input always stays at the bottom */}
      <div className="px-6 overflow min-h-[83%] p-1 dark:bg-zinc-800  ">
        {messagesLoading || userLoading ? loadingPlaceholder : messageListJsx}
      </div>
      <ChatFooter ref={inputRef} sendPost={sendPost} />
    </div>
  );
}

export default Chat;
