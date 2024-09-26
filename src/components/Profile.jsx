import { useState } from "react";
import { profileOptions } from "../utils";

export const Profile = ({ isPair, toggleIsPair }) => {
  const [activeProfile, setActiveProfile] = useState(null); // State to store the active profile

  const activeDesign = (id) => {
    setActiveProfile(id); // Set the clicked profile as active

    // Send a message to the parent window
    window.parent.postMessage(`${id}`, "*"); // Send message to Configurator
  };

  return (
    <div className="mb-auto">
      <div className="py-3 flex items-center bg-white">
        <input
          id="expertToggle"
          type="checkbox"
          checked={isPair}
          onChange={toggleIsPair}
          className="mr-2"
        />
        <label className="text-sm font-semibold">
          Use the same settings for both rings
        </label>
      </div>

      <div className="py-5 max-w-lg mx-auto">
        <p className="py-1 mb-2.5 font-semibold">Profile</p>

        <div className="profile-container">
          <ul className="flex flex-wrap gap-2">
            {profileOptions.map((profile, index) => (
              <li
                key={index}
                className={`border w-[calc(34%-10px)] lg:w-[calc(25%-10px)] bg-cover bg-center bg-no-repeat cursor-pointer ${
                  activeProfile === profile.title ? "border-[#205FA8]" : ""
                }`}
                onClick={() => activeDesign(profile.title)}
              >
                <img src={profile.src} className="w-full" alt={profile.title} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
