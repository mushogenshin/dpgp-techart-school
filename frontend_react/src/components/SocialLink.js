import InstagramLogo from "./logo/InstagramLogo";
import ArtStationLogo from "./logo/ArtStationLogo";
import LinkedInLogo from "./logo/LinkedInLogo";

export default function SocialLink({ social }) {
  return (
    <a href={social.data} target="_blank" rel="noreferrer noopener">
      {social.type === "instagram" ? (
        <InstagramLogo />
      ) : social.type === "artstation" ? (
        <ArtStationLogo />
      ) : social.type === "linkedin" ? (
        <LinkedInLogo />
      ) : null}
    </a>
  );
}
