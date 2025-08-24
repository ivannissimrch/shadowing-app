// import styles from "./page.module.css";
// import Card from "../components/Card";
// import { User } from "../Types";
// import { useAppContext } from "../AppContext";
// const API_URL = process.env.NEXT_PUBLIC_API_URL;

// export default async function Users({
//   params,
// }: {
//   params: Promise<{ user: string }>;
// }) {
//   const resolvedParams = await params;
//   const { token } = useAppContext();

//   console.log("Token from context:", token);
//   console.log("Resolved Params:", resolvedParams);

//   const userName = resolvedParams.user;
//   const response = await fetch(`${API_URL}/api/users/${userName}`);
//   const result = await response.json();
//   const currentUser: User = result.data;
//   console.log("Current User:", currentUser);

//   return (
//     <main className={styles.main}>
//       <div className={styles.container}>
//         <h1 className={styles.title}>ShadowSpeak</h1>
//         <p className={styles.subtitle}>
//           Master English pronunciation through shadowing practice
//         </p>
//         <h2 className={styles.heading}>Choose a Video to Practice</h2>
//         <p className={styles.description}>
//           Select a video that matches your level and interests
//         </p>
//         <div className={styles["cards-container"]}>
//           {currentUser?.lessons.map((currentLesson) => (
//             <Card
//               key={currentLesson.title}
//               currentLesson={currentLesson}
//               userName={userName}
//             />
//           ))}
//         </div>
//       </div>
//     </main>
//   );
// }

"use client";
import { useEffect, useState } from "react";
import styles from "./page.module.css";
import Card from "../components/Card";
import { User } from "../Types";
import { useAppContext } from "../AppContext";
import Logout from "../components/Logout";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function Users({
  params,
}: {
  params: Promise<{ user: string }>;
}) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userName, setUserName] = useState<string>("");
  const { token } = useAppContext();
  console.log("Token from context:", token);

  useEffect(() => {
    async function loadData() {
      const resolvedParams = await params;
      const userNameFromParams = resolvedParams.user;
      setUserName(userNameFromParams);
      if (!token) return;
      const response = await fetch(
        `${API_URL}/api/users/${userNameFromParams}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Fetch Response:", response);
      const result = await response.json();
      setCurrentUser(result.data);
    }

    loadData();
  }, [params, token]);

  if (!currentUser) return <div>Loading...</div>;

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>ShadowSpeak</h1>
        <p className={styles.subtitle}>
          Master English pronunciation through shadowing practice
          <Logout />
        </p>
        <h2 className={styles.heading}>Choose a Video to Practice</h2>
        <p className={styles.description}>
          Select a video that matches your level and interests
        </p>
        <div className={styles["cards-container"]}>
          {currentUser?.lessons.map((currentLesson) => (
            <Card
              key={currentLesson.title}
              currentLesson={currentLesson}
              userName={userName}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
