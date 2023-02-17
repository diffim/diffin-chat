import {
  Avatar,
  Box,
  LinearProgress,
  Skeleton,
  Tab,
  Tabs,
  tabsClasses,
} from "@mui/material";
import React, { Dispatch, SetStateAction, useState } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import { Link } from "react-router-dom";
import { firebaseDb } from "../firebase";

function Users() {
  const [value, setValue] = useState(0);
  const [users, loading, error] = useCollection(
    firebaseDb.collection("users") as any
  );

  const skeletonArray = new Array(30).fill(1);

  const loadingPlaceholder = skeletonArray.map((skeleton, index) => (
    <Tab
      key={index}
      sx={{
        paddingLeft: "2px",
        paddingRight: "2px",
        minWidth: "70px",
      }}
      label={
        <Skeleton variant="circular">
          <Avatar sx={{ width: 45, height: 45 }} />
        </Skeleton>
      }
    />
  ));

  //copy pasted stuff from stacvkoverflow to make a unique array
  //yes i couldnt actually implement unique pushing to the database
  const uniqueList = users?.docs.filter(
    (listItem, index, self) =>
      index ===
      self.findIndex(
        (obj) => obj.data().profilepic === listItem.data().profilepic
      )
  );

  const userList = uniqueList?.map((user) => (
    <Tab
      key={user?.id}
      sx={{
        paddingLeft: "2px",
        paddingRight: "2px",
        minWidth: "68px",
      }}
      className="group "
      label={
        <div className="relative">
          <div
            className="opacity-0 transition-opacity duration-300 break-all ease-linear group-hover:opacity-100 flex 
          w-[45px] text-white overflow-hidden z-50 text-[9px] justify-center items-center  
            absolute flex-wrap h-[45px] bg-zinc-900/80 rounded-[30px]    "
          >
            {user?.data().name}
          </div>
          <Avatar
            sx={{ width: 45, height: 45 }}
            src={user?.data().profilepic}
          />
        </div>
      }
    />
  ));

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <div className="col-span-full w-screen  border-t-zinc-300 border-t-2 dark:border-none dark:zincbg ">
      <Tabs
        variant="scrollable"
        scrollButtons
        value={value}
        onChange={handleChange}
        sx={{
          [`& .${tabsClasses.scrollButtons}`]: {
            "&.Mui-disabled": { opacity: 0.3 },
          },
        }}
      >
        {loading ? loadingPlaceholder : userList}
      </Tabs>
    </div>
  );
}

export default Users;
