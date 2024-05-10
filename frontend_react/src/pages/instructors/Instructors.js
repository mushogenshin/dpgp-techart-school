import { useFetchPublicPage } from "../../hooks/firestore/useFetchPublicPage";
import ContentBlock from "../../components/ContentBlock/ContentBlock";
import SocialLink from "../../components/SocialLink";

import styles from "./Instructors.module.css";

export default function Instructors() {
  const {
    pageData: memberList,
    error: memberListError,
    isPending: isMemberListPending,
  } = useFetchPublicPage("instructors");

  const {
    pageData: members,
    error: membersError,
    isPending: isMembersPending,
  } = useFetchPublicPage("members");

  const memberListArray = memberList?.members || [];

  return (
    <div className={styles.about}>
      {memberListError ||
        (membersError && <h2>😳 {memberListError || membersError}</h2>)}

      {isMemberListPending || isMembersPending ? (
        <p>Đợi xíu nha 😙...</p>
      ) : (
        <div>
          {memberListArray.map(
            (name, index) =>
              members[name] && (
                <Member key={index} name={name} member={members[name]} />
              )
          )}
        </div>
      )}
    </div>
  );
}

function Member({ name, member }) {
  const display_name = member.display_name || name;
  const socials = member.socials || [];
  const blocks = member.blocks || [];

  return (
    <div id={name}>
      <h2>
        <a href={`#${name}`}>{display_name}</a>{" "}
        <span>
          {socials.map((social, index) => (
            <span key={index}>
              <SocialLink key={index} social={social} />{" "}
            </span>
          ))}
        </span>
      </h2>
      {blocks.map((block, index) => (
        <ContentBlock key={index} block={block} />
      ))}
    </div>
  );
}
