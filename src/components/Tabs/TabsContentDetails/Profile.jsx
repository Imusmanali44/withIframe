import { useState, useEffect } from "react";
import { profileOptions } from "../../../utils";
import IsPair from "../../shared/IsPair";

export const Profile = ({ rings, activeRing, isPair, setIsPair }) => {
  const [activeProfile, setActiveProfile] = useState(null); // State to store the active profile

  // Load activeProfile from localStorage on component mount
  useEffect(() => {
    // Create a storage key based on the active ring to store different profiles for different rings
    const storageKey = Array.isArray(activeRing) 
      ? `activeProfile_${activeRing[0]?.name}_${activeRing[1]?.name}` 
      : `activeProfile_${activeRing?.name}`;
    
    const savedProfile = localStorage.getItem(storageKey);
    
    // If there's a saved profile, use it; otherwise, default to the first profile
    const profileToUse = savedProfile || (profileOptions[0]?.title || null);
    
    // Set the active profile
    setActiveProfile(profileToUse);
    
    // // Send a message to update the model on initial load
    // if (profileToUse) {
    //   window.parent.postMessage({ 
    //     action: "changeModel", 
    //     modelId: profileToUse,
    //     selectedRing: activeRing, 
    //     pair: isPair 
    //   }, "*");
      
    //   // If this is the first time (no saved profile), save the default to localStorage
    //   if (!savedProfile) {
    //     localStorage.setItem(storageKey, profileToUse);
    //   }
    // }
  }, [activeRing, isPair]);

  const activeDesign = (id) => {
    setActiveProfile(id); // Set the clicked profile as active

    // Save to localStorage
    const storageKey = Array.isArray(activeRing) 
      ? `activeProfile_${activeRing[0]?.name}_${activeRing[1]?.name}` 
      : `activeProfile_${activeRing?.name}`;
    
    localStorage.setItem(storageKey, id);

    // Send a message to the parent window
    window.parent.postMessage({ 
      action: "changeModel", 
      modelId: id,
      selectedRing: activeRing, 
      pair: isPair 
    }, "*"); // Send message to Configurator
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
                <img src={profile.src || "/placeholder.svg"} className="w-full" alt={profile.title} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};