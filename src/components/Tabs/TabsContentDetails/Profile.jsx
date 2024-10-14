import { useState } from "react";
import { profileOptions } from "../../../utils";
import IsPair from "../../shared/IsPair";

export const Profile = ({ rings, activeRing, isPair, setIsPair }) => {
  const [activeProfile, setActiveProfile] = useState(null); // State to store the active profile

  const activeDesign = (id) => {
    setActiveProfile(id); // Set the clicked profile as active

    // Send a message to the parent window
    window.parent.postMessage({ action: "changeModel", modelId: id,selectedRing: activeRing, pair:isPair }, "*"); // Send message to Configurator
  };

  return (
    <div className="mb-auto">
      {rings &&
        (rings[0]?.type === rings[1]?.type ||
          rings[2]?.type === rings[3]?.type) && (
          <IsPair
            activeRing={activeRing}
            isPair={isPair}
            setIsPair={setIsPair}
          />
        )}

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
