import { useFetchLivePage } from "../../hooks/firestore/useFetchLivePage";
import ContentBlock from "../../components/contentBlock/ContentBlock";
import SocialLink from "../../components/contentBlock/SocialLink";

import styles from "./Instructors.module.css";

export default function Instructors() {
  const {
    pageData: memberList,
    error: memberListError,
    isPending: isMemberListPending,
  } = useFetchLivePage("public_pages", "instructors");

  const {
    pageData: members,
    error: membersError,
    isPending: isMembersPending,
  } = useFetchLivePage("public_pages", "members");

  const memberListArray = memberList?.members || [];

  return (
    <div className={styles.about}>
      {(memberListError || membersError) && (
        <h2>
          😳 Failed to fetch "instructors"/"members":{" "}
          {memberListError || membersError}
        </h2>
      )}

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
        <ContentBlock key={index} inner={block} />
      ))}
    </div>
  );
}
