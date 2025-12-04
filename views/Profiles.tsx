
import React, { useState } from 'react';
import { Plus, Lock, X, Trash2, User, Pencil, Check } from 'lucide-react';
import { Profile } from '../types';

interface ProfilesProps {
  onSelectProfile: (profile: Profile) => void;
}

const INITIAL_PROFILES: Profile[] = [
  { id: 1, name: 'GIOVANE INES', avatar: 'https://img.freepik.com/free-psd/3d-illustration-human-avatar-profile_23-2150671142.jpg', isKid: false },
  { id: 2, name: 'amanda', avatar: 'https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436188.jpg', isKid: false, locked: true, pin: '1122' },
  { id: 3, name: 'Junior', avatar: 'https://img.freepik.com/free-psd/3d-illustration-with-cute-cartoon-boy-with-backpack_23-2149349422.jpg', isKid: false },
  { id: 4, name: 'Infantil', avatar: 'https://img.freepik.com/free-vector/gradient-colored-background_23-2149129524.jpg', isKid: true },
];

export const Profiles: React.FC<ProfilesProps> = ({ onSelectProfile }) => {
  const [profiles, setProfiles] = useState<Profile[]>(INITIAL_PROFILES);
  const [isManaging, setIsManaging] = useState(false);
  
  // PIN State
  const [pinModalOpen, setPinModalOpen] = useState(false);
  const [pinContext, setPinContext] = useState<'ACCESS' | 'DELETE'>('ACCESS');
  const [selectedLockedProfile, setSelectedLockedProfile] = useState<Profile | null>(null);
  const [pin, setPin] = useState(['', '', '', '']);
  const [error, setError] = useState(false);

  // Create Profile State
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');
  const [newProfileIsKid, setNewProfileIsKid] = useState(false);
  const [newProfileHasPin, setNewProfileHasPin] = useState(false);
  const [newProfilePin, setNewProfilePin] = useState('');

  const handleProfileClick = (profile: Profile) => {
    if (isManaging) {
        return;
    }

    if (profile.locked) {
      setPinContext('ACCESS');
      setSelectedLockedProfile(profile);
      setPin(['', '', '', '']);
      setError(false);
      setPinModalOpen(true);
    } else {
      onSelectProfile(profile);
    }
  };

  const handleDeleteRequest = (profile: Profile) => {
      if (profile.locked) {
          setPinContext('DELETE');
          setSelectedLockedProfile(profile);
          setPin(['', '', '', '']);
          setError(false);
          setPinModalOpen(true);
      } else {
          setProfiles(prev => prev.filter(p => p.id !== profile.id));
      }
  };

  const resetCreateModal = () => {
      setCreateModalOpen(false);
      setNewProfileName('');
      setNewProfileIsKid(false);
      setNewProfileHasPin(false);
      setNewProfilePin('');
  };

  const handleCreateProfile = () => {
      if (!newProfileName.trim()) return;
      if (newProfileHasPin && newProfilePin.length !== 4) return;

      const newId = Math.max(...profiles.map(p => p.id), 0) + 1;
      const newProfile: Profile = {
          id: newId,
          name: newProfileName,
          avatar: newProfileIsKid 
            ? 'https://img.freepik.com/free-vector/gradient-colored-background_23-2149129524.jpg'
            : `https://i.pravatar.cc/300?u=${newId}`,
          isKid: newProfileIsKid,
          locked: newProfileHasPin,
          pin: newProfileHasPin ? newProfilePin : undefined
      };

      setProfiles([...profiles, newProfile]);
      resetCreateModal();
  };

  const handlePinChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;
    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);

    if (value && index < 3) {
      const nextInput = document.getElementById(`pin-${index + 1}`);
      nextInput?.focus();
    }

    if (index === 3 && value) {
      const enteredPin = newPin.join('');
      const requiredPin = selectedLockedProfile?.pin || '1122';
      
      if (enteredPin === requiredPin) {
         setTimeout(() => {
             if (selectedLockedProfile) {
                 if (pinContext === 'ACCESS') {
                    onSelectProfile(selectedLockedProfile);
                 } else if (pinContext === 'DELETE') {
                    setProfiles(prev => prev.filter(p => p.id !== selectedLockedProfile.id));
                    setPinModalOpen(false);
                 }
             }
         }, 300);
      } else {
        setError(true);
        setTimeout(() => {
            setPin(['', '', '', '']);
            setError(false);
            document.getElementById('pin-0')?.focus();
        }, 1000);
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Backspace' && !pin[index] && index > 0) {
          const prevInput = document.getElementById(`pin-${index - 1}`);
          prevInput?.focus();
      }
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden font-sans">
      {/* Background Image - Mobile Style */}
      <div className="absolute inset-0 z-0">
          <img 
            src="https://images7.alphacoders.com/133/1337449.jpeg" // Solar Opposites style background
            alt="Background" 
            className="w-full h-full object-cover"
          />
          {/* Gradients to make text readable */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/90"></div>
          <div className="absolute bottom-0 left-0 right-0 h-3/4 bg-gradient-to-t from-black via-black/80 to-transparent"></div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 flex flex-col h-full justify-end pb-12 md:pb-20 md:justify-center md:items-center">
        
        {/* Header Content for Mobile */}
        <div className="text-center mb-8 px-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
             <div className="md:hidden mb-12">
                 <h1 className="text-4xl font-black text-white drop-shadow-lg tracking-tighter uppercase mb-2" style={{fontFamily: 'Impact, sans-serif'}}>SOLAR</h1>
                 <h1 className="text-3xl font-light text-white drop-shadow-lg tracking-[0.2em] uppercase" style={{fontFamily: 'Impact, sans-serif'}}>OPPOSITES</h1>
             </div>
             <p className="text-white text-sm font-medium drop-shadow-md mb-8">Novas temporadas em 15 de dezembro</p>
             <h2 className="text-lg md:text-3xl text-gray-200 font-medium">Escolha o seu perfil</h2>
        </div>

        {/* Profiles Grid */}
        <div className="flex flex-wrap justify-center items-start gap-4 px-6 max-w-4xl mx-auto">
          {profiles.map((profile) => (
            <div key={profile.id} className="relative group flex flex-col items-center gap-2 w-[84px] md:w-32 transition-transform active:scale-95">
              <button
                  onClick={() => handleProfileClick(profile)}
                  className={`relative w-[84px] h-[84px] md:w-32 md:h-32 rounded-lg md:rounded-xl overflow-hidden shadow-lg transition-all ${isManaging ? 'opacity-80' : ''}`}
              >
                <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
                {profile.locked && (
                  <div className="absolute top-1 right-1 md:top-2 md:right-2 w-5 h-5 md:w-6 md:h-6 bg-black/60 rounded-full flex items-center justify-center backdrop-blur-sm">
                      <Lock size={10} className="text-white md:w-3 md:h-3" />
                  </div>
                )}
                
                {isManaging && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <User size={24} className="text-white opacity-80" />
                    </div>
                )}
              </button>
              
              {isManaging && (
                  <button 
                      onClick={() => handleDeleteRequest(profile)}
                      className="absolute -top-2 -right-2 w-7 h-7 bg-red-600 text-white rounded-full flex items-center justify-center shadow-md z-20 animate-in zoom-in"
                  >
                      <Trash2 size={12} />
                  </button>
              )}

              <span className="text-white text-xs md:text-lg font-medium text-center truncate w-full drop-shadow-md">
                {profile.name}
              </span>
            </div>
          ))}

          {/* Add Profile Button */}
          <div className="flex flex-col items-center gap-2 w-[84px] md:w-32">
              <button 
                  onClick={() => setCreateModalOpen(true)}
                  className="w-[84px] h-[84px] md:w-32 md:h-32 rounded-lg md:rounded-xl bg-[#1a1a1a]/80 backdrop-blur-sm flex items-center justify-center border border-gray-600 hover:bg-white/10 transition-all shadow-lg"
              >
                <Plus size={32} className="text-white" />
              </button>
              <span className="text-gray-300 text-xs md:text-lg font-medium">Adicionar</span>
          </div>

           {/* Edit Profile Button (Toggle Manage Mode) */}
           <div className="flex flex-col items-center gap-2 w-[84px] md:w-32">
              <button 
                  onClick={() => setIsManaging(!isManaging)}
                  className={`w-[84px] h-[84px] md:w-32 md:h-32 rounded-lg md:rounded-xl backdrop-blur-sm flex items-center justify-center border transition-all shadow-lg ${isManaging ? 'bg-white text-black border-white' : 'bg-[#1a1a1a]/80 border-gray-600 text-white hover:bg-white/10'}`}
              >
                {isManaging ? <Check size={32} /> : <Pencil size={28} />}
              </button>
              <span className="text-gray-300 text-xs md:text-lg font-medium">{isManaging ? 'Concluir' : 'Editar'}</span>
          </div>
        </div>
      </div>

      {/* PIN Modal */}
      {pinModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md animate-in fade-in duration-200 p-4">
            <div className="bg-[#1a1a1a] border border-gray-700 p-8 rounded-2xl w-full max-w-sm relative shadow-2xl">
                <button 
                    onClick={() => setPinModalOpen(false)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white"
                >
                    <X size={24} />
                </button>
                
                <h3 className="text-center text-white text-xl font-bold mb-2">
                    {pinContext === 'DELETE' ? 'Excluir Perfil?' : 'Digite o PIN'}
                </h3>
                <p className="text-center text-gray-400 text-sm mb-8">
                    {pinContext === 'DELETE' 
                        ? `Digite o PIN para confirmar a exclusão de ${selectedLockedProfile?.name}.`
                        : `Código para acessar o perfil de ${selectedLockedProfile?.name}`
                    }
                </p>
                
                <div className="flex justify-center gap-4 mb-6">
                    {pin.map((digit, index) => (
                        <input
                            key={index}
                            id={`pin-${index}`}
                            type="tel" 
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handlePinChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            className={`w-12 h-14 bg-black border ${error ? 'border-red-500 text-red-500' : 'border-gray-700 text-white focus:border-blue-500'} rounded-lg text-center text-2xl font-bold outline-none transition-all`}
                        />
                    ))}
                </div>
                
                {error && (
                    <p className="text-red-500 text-xs text-center animate-pulse">PIN incorreto. Tente novamente.</p>
                )}
            </div>
        </div>
      )}

      {/* Create Profile Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md animate-in fade-in duration-200 p-4">
            <div className="bg-[#1a1a1a] border border-gray-700 p-6 rounded-2xl w-full max-w-md relative shadow-2xl">
                <button 
                    onClick={resetCreateModal}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white"
                >
                    <X size={24} />
                </button>
                
                <h3 className="text-white text-xl font-bold mb-6">Adicionar Perfil</h3>
                
                <div className="space-y-6">
                    <div>
                        <label className="block text-xs font-medium text-gray-400 mb-2">Nome</label>
                        <input 
                            type="text" 
                            value={newProfileName}
                            onChange={(e) => setNewProfileName(e.target.value)}
                            className="w-full bg-[#333] border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-blue-500 focus:outline-none placeholder:text-gray-500"
                            placeholder="Nome do perfil"
                            autoFocus
                        />
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-[#333] rounded-lg border border-gray-600">
                        <input 
                            type="checkbox" 
                            id="kid-check"
                            checked={newProfileIsKid}
                            onChange={(e) => setNewProfileIsKid(e.target.checked)}
                            className="w-5 h-5 rounded border-gray-500 text-blue-600 focus:ring-blue-600 bg-gray-700"
                        />
                        <label htmlFor="kid-check" className="flex-1 cursor-pointer">
                            <span className="block text-sm font-bold text-white">Perfil Infantil</span>
                            <span className="block text-xs text-gray-400">Exibir apenas conteúdo para até 12 anos.</span>
                        </label>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-[#333] rounded-lg border border-gray-600">
                        <input 
                            type="checkbox" 
                            id="pin-check"
                            checked={newProfileHasPin}
                            onChange={(e) => setNewProfileHasPin(e.target.checked)}
                            className="w-5 h-5 rounded border-gray-500 text-blue-600 focus:ring-blue-600 bg-gray-700"
                        />
                        <label htmlFor="pin-check" className="flex-1 cursor-pointer">
                            <span className="block text-sm font-bold text-white">Proteger com PIN</span>
                            <span className="block text-xs text-gray-400">Exigir código para acessar este perfil.</span>
                        </label>
                    </div>

                    {newProfileHasPin && (
                        <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                            <label className="block text-xs font-medium text-gray-400 mb-2">Digite o PIN (4 dígitos)</label>
                            <input 
                                type="tel" 
                                inputMode="numeric"
                                maxLength={4}
                                value={newProfilePin}
                                onChange={(e) => setNewProfilePin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                                className="w-full bg-[#333] border border-gray-600 rounded-lg px-4 py-3 text-white text-center tracking-[1em] font-bold focus:border-blue-500 focus:outline-none placeholder:text-gray-500"
                                placeholder="0000"
                            />
                        </div>
                    )}

                    <div className="flex gap-3 pt-4">
                        <button 
                            onClick={resetCreateModal}
                            className="flex-1 px-4 py-3 bg-transparent border border-gray-600 text-gray-300 rounded-lg font-medium hover:border-gray-400 hover:text-white transition-colors"
                        >
                            Cancelar
                        </button>
                        <button 
                            onClick={handleCreateProfile}
                            disabled={!newProfileName.trim() || (newProfileHasPin && newProfilePin.length !== 4)}
                            className="flex-1 px-4 py-3 bg-white text-black rounded-lg font-bold hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Salvar
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};
