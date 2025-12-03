import React from 'react';
import { Plus, Lock } from 'lucide-react';
import { Profile } from '../types';

interface ProfilesProps {
  onSelectProfile: (profile: Profile) => void;
}

export const Profiles: React.FC<ProfilesProps> = ({ onSelectProfile }) => {
  const profiles: Profile[] = [
    { id: 1, name: 'João', avatar: 'https://img.freepik.com/free-psd/3d-illustration-human-avatar-profile_23-2150671142.jpg', isKid: false },
    { id: 2, name: 'Maria', avatar: 'https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436188.jpg', isKid: false, locked: true },
    { id: 3, name: 'Kids', avatar: 'https://img.freepik.com/free-psd/3d-illustration-human-avatar-profile_23-2150671122.jpg', isKid: true },
  ];

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center animate-in fade-in duration-500">
      <div className="mb-12 flex flex-col items-center">
         <div className="flex items-center gap-1 mb-10 transform scale-150">
             <div className="text-blue-600">
               <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                 <path d="M5 3L19 12L5 21V3Z" />
               </svg>
             </div>
             <div className="font-bold text-2xl tracking-tight">
                <span className="text-white">Stream</span><span className="text-blue-600">ix</span>
             </div>
          </div>
        <h1 className="text-3xl md:text-4xl font-medium text-white">Quem está assistindo?</h1>
      </div>

      <div className="flex flex-wrap justify-center gap-4 md:gap-8 px-4">
        {profiles.map((profile) => (
          <button
            key={profile.id}
            onClick={() => onSelectProfile(profile)}
            className="group flex flex-col items-center gap-3 w-28 md:w-36 transition-transform hover:scale-105"
          >
            <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden border-2 border-transparent group-hover:border-white transition-all">
              <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
              {profile.locked && (
                <div className="absolute top-2 right-2 w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                    <Lock size={12} className="text-white" />
                </div>
              )}
            </div>
            <div className="flex flex-col items-center">
                <span className="text-gray-400 group-hover:text-white text-lg font-medium transition-colors">
                {profile.name}
                </span>
                {profile.isKid && <span className="text-xs text-gray-500">Perfil Infantil</span>}
            </div>
          </button>
        ))}

        <button className="group flex flex-col items-center gap-3 w-28 md:w-36 transition-transform hover:scale-105">
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-[#1a1a1a] flex items-center justify-center border-2 border-transparent group-hover:border-white group-hover:bg-[#2a2a2a] transition-all">
            <Plus size={40} className="text-gray-400 group-hover:text-white" />
          </div>
          <span className="text-gray-400 group-hover:text-white text-lg font-medium transition-colors">
            Adicionar Perfil
          </span>
        </button>
      </div>

      <button className="mt-16 border border-gray-600 text-gray-400 hover:text-white hover:border-white px-6 py-2 rounded-lg text-sm tracking-widest font-medium uppercase transition-all">
        Gerenciar Perfis
      </button>
    </div>
  );
};