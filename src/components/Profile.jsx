import { useEffect } from "react";
import { profileOptions } from "../utils";

export const Profile = ({ isPair, toggleIsPair }) => {
  const activeDesign = (id) => {
    // console.log(id, "ring clicked");

    // Send a message to the parent window
    window.parent.postMessage(`${id}`, '*'); // Send message to Configurator
  };

  // No need to handle messages in Profile unless you want to receive from Configurator
  return (
    <>
      <div className="mb-5 flex items-center">
        <input
          id="expertToggle"
          type="checkbox"
          checked={isPair}
          onChange={toggleIsPair}
          className="mr-2"
        />
        <label className="text-sm font-medium text-gray-800">
          Use the same settings for both rings
        </label>
      </div>

      <p className="ml-5 text-gray-800 text-sm">Profile</p>

      <div className="profile-container mt-4">
        <ul className="flex flex-wrap">
          {profileOptions.map((profile, index) => (
            <li
              key={index}
              className="border w-1/4 bg-cover bg-center bg-no-repeat cursor-pointer"
              onClick={() => activeDesign(profile.title)}
            >
              <img src={profile.src} className="w-full" />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};
