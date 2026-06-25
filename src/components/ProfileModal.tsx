// @ts-nocheck
'use client'
import { X, Crown, Shield, MessageCircle, FileText, Calendar, Clock, Trophy, Target, TrendingUp, Eye } from "lucide-react";
import { TrophyBadge, TrophyShowcase } from "./TrophyBadge";
import { RiotProfileLoader, ChampionMasteryDisplay } from "./RiotProfileLoader";
import { ReputationSystem } from "./ReputationSystem";
import { RankBadge } from "./RankBadge";
import { SeasonRankHistory } from "./SeasonRankHistory";
import { useState, useRef, useEffect } from "react";
import type { SeasonRank } from "../utils/riotApi";
const statusOnline = "/assets/89acff5e3f002bca6acbad8bdee1a214d46ccb3f.png";
const statusBusy = "/assets/413093ab215ae8d33c2f5f1e67792773d08b8f4e.png";
const statusOffline = "/assets/a9647b068cbf551f7448b9bb446d6d970434682f.png";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  userEmail: string;
  userRegion: string;
  userAvatar: string;
  userBanner: string;
  userJoinDate: string;
  setUserAvatar: (avatar: string) => void;
  setUserBanner: (banner: string) => void;
  setUserName: (name: string) => void;
  setUserEmail: (email: string) => void;
  isOwner: boolean;
  isAdmin: boolean;
  riotProfileData: any;
  riotAccountLinked: boolean;
  riotDataIsReal: boolean;
  riotLinkedRegion: "euw" | "eune" | null;
  riotSummonerName: string;
  seasonRanks: SeasonRank[];
  setRiotAccountLinked: (linked: boolean) => void;
  setRiotProfileData: (data: any) => void;
  setRiotDataIsReal: (isReal: boolean) => void;
  setRiotSummonerName: (name: string) => void;
  setRiotLinkedRegion: (region: "euw" | "eune" | null) => void;
  setRiotSelectedRegion: (region: "euw" | "eune") => void;
  setIsRiotSyncOpen: (open: boolean) => void;
  setUserRank: (rank: string | null) => void;
  handleImageUpload: (file: File, type: 'avatar' | 'banner') => void;
  userStatus: 'online' | 'busy' | 'offline';
  onStatusChange: (status: 'online' | 'busy' | 'offline') => void;
  userNameColor: string;
  setIsColorPickerOpen: (open: boolean) => void;
  userProfileBackground: string;
  setIsBackgroundPickerOpen: (open: boolean) => void;
  hasPremium: boolean;
  tournamentEarnings?: number;
}

export function ProfileModal({
  isOpen,
  onClose,
  userName,
  userEmail,
  userRegion,
  userAvatar,
  userBanner,
  userJoinDate,
  setUserAvatar,
  setUserBanner,
  setUserName,
  setUserEmail,
  isOwner,
  isAdmin,
  riotProfileData,
  riotAccountLinked,
  riotDataIsReal,
  riotLinkedRegion,
  riotSummonerName,
  seasonRanks,
  setRiotAccountLinked,
  setRiotProfileData,
  setRiotDataIsReal,
  setRiotSummonerName,
  setRiotLinkedRegion,
  setRiotSelectedRegion,
  setIsRiotSyncOpen,
  setUserRank,
  handleImageUpload,
  userStatus,
  onStatusChange,
  userNameColor,
  setIsColorPickerOpen,
  userProfileBackground,
  setIsBackgroundPickerOpen,
  hasPremium,
  tournamentEarnings
}: ProfileModalProps) {
  const [profileTab, setProfileTab] = useState<"overview" | "settings">("overview");
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [imageType, setImageType] = useState<'avatar' | 'banner' | null>(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [showGrid, setShowGrid] = useState(true);
  const [minScale, setMinScale] = useState(1);
  const canvasRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // Settings state
  const [editUsername, setEditUsername] = useState(userName);
  const [editEmail, setEditEmail] = useState(userEmail);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profileVisibility, setProfileVisibility] = useState<'public' | 'private'>('public');
  const [showOnlineStatus, setShowOnlineStatus] = useState(true);
  const [acceptMessagesFrom, setAcceptMessagesFrom] = useState<'everyone' | 'friends'>('everyone');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [newMessageNotifications, setNewMessageNotifications] = useState(true);
  const [systemUpdates, setSystemUpdates] = useState(true);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Track changes
  useEffect(() => {
    const changed = editUsername !== userName || editEmail !== userEmail;
    setHasUnsavedChanges(changed);
  }, [editUsername, editEmail, userName, userEmail]);

  const saveAccountChanges = () => {
    setUserName(editUsername);
    setUserEmail(editEmail);
    setHasUnsavedChanges(false);
    alert('Account information updated successfully!');
  };

  const discardAccountChanges = () => {
    setEditUsername(userName);
    setEditEmail(userEmail);
    setHasUnsavedChanges(false);
  };

  const changePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert('Please fill in all password fields');
      return;
    }
    if (newPassword !== confirmPassword) {
      alert('New passwords do not match');
      return;
    }
    if (newPassword.length < 8) {
      alert('Password must be at least 8 characters');
      return;
    }
    // In real app, would validate current password and save new one
    alert('Password changed successfully!');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleDeleteAccount = () => {
    // In real app, would delete account
    alert('Account deletion feature - would delete account in production');
    setShowDeleteConfirm(false);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !imageRef.current || !canvasRef.current) return;
    
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;
    
    // Get the actual rendered size of the image in the viewport
    const imgBounds = imageRef.current.getBoundingClientRect();
    const canvasBounds = canvasRef.current.getBoundingClientRect();
    
    // Calculate scaled dimensions (in viewport pixels)
    const scaledWidth = imgBounds.width;
    const scaledHeight = imgBounds.height;
    
    // Get crop area dimensions (in viewport pixels) - FIXED SIZES
    let cropWidth, cropHeight;
    if (imageType === 'avatar') {
      cropWidth = 360; // Fixed circular crop size
      cropHeight = 360;
    } else {
      // Banner: Full-width crop for proper aspect ratio matching profile display
      // Profile banner is full-width x h-36, which is ~6-7:1 aspect
      // Using 720x120 (aspect 6:1) to better match final display
      cropWidth = 720;
      cropHeight = 120;
    }
    
    // Calculate maximum allowed offset
    // Image edges must not go inside crop area
    const maxX = Math.max(0, (scaledWidth - cropWidth) / 2);
    const maxY = Math.max(0, (scaledHeight - cropHeight) / 2);
    
    // Clamp position to keep image covering crop area
    const clampedX = Math.max(-maxX, Math.min(maxX, newX));
    const clampedY = Math.max(-maxY, Math.min(maxY, newY));
    
    setPosition({
      x: clampedX,
      y: clampedY
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const resetPosition = () => {
    setPosition({ x: 0, y: 0 });
    setScale(1);
  };

  const centerImage = () => {
    setPosition({ x: 0, y: 0 });
  };

  const resetAll = () => {
    setPosition({ x: 0, y: 0 });
    setScale(1);
    setRotation(0);
    setFlipH(false);
    setFlipV(false);
    setBrightness(100);
    setContrast(100);
  };

  // Calculate minimum scale to cover crop area when image loads
  useEffect(() => {
    if (!imageSrc || !canvasRef.current) return;

    const img = new Image();
    img.onload = () => {
      const canvasBounds = canvasRef.current!.getBoundingClientRect();
      const containerWidth = canvasBounds.width;
      const containerHeight = canvasBounds.height;
      
      // Calculate how image fits with object-fit: contain
      const imgRatio = img.width / img.height;
      const containerRatio = containerWidth / containerHeight;
      
      let renderWidth, renderHeight;
      if (imgRatio > containerRatio) {
        renderWidth = containerWidth;
        renderHeight = containerWidth / imgRatio;
      } else {
        renderHeight = containerHeight;
        renderWidth = containerHeight * imgRatio;
      }
      
      // Calculate crop area dimensions - FIXED SIZES
      let cropWidth, cropHeight;
      if (imageType === 'avatar') {
        cropWidth = 360;
        cropHeight = 360;
      } else {
        // Banner: Full-width crop for proper aspect ratio matching profile display
        // Profile banner is full-width x h-36, which is ~6-7:1 aspect
        // Using 720x120 (aspect 6:1) to better match final display
        cropWidth = 720;
        cropHeight = 120;
      }
      
      // Calculate minimum scale needed to cover crop area
      const minScaleX = cropWidth / renderWidth;
      const minScaleY = cropHeight / renderHeight;
      const minScale = Math.max(minScaleX, minScaleY, 1); // At least 1x
      
      setScale(minScale);
      setPosition({ x: 0, y: 0 });
      setMinScale(minScale);
    };
    
    img.src = imageSrc;
  }, [imageSrc, imageType]);

  // Adjust position when scale changes to keep image within bounds
  useEffect(() => {
    if (!imageRef.current || !canvasRef.current) return;

    const img = imageRef.current;
    const imgWidth = img.naturalWidth;
    const imgHeight = img.naturalHeight;
    
    const scaledWidth = imgWidth * scale;
    const scaledHeight = imgHeight * scale;
    
    const canvasBounds = canvasRef.current.getBoundingClientRect();
    const canvasWidth = canvasBounds.width;
    const canvasHeight = canvasBounds.height;
    
    let cropWidth, cropHeight;
    if (imageType === 'avatar') {
      cropWidth = 360;
      cropHeight = 360;
    } else {
      cropWidth = canvasBounds.width - 64; // inset-8 = 32px * 2
      cropHeight = canvasBounds.height - 64;
    }
    
    const maxX = (scaledWidth - cropWidth) / 2;
    const maxY = (scaledHeight - cropHeight) / 2;
    
    // Clamp current position to new bounds
    setPosition(prev => ({
      x: Math.max(-maxX, Math.min(maxX, prev.x)),
      y: Math.max(-maxY, Math.min(maxY, prev.y))
    }));
  }, [scale, imageType]);

  const saveCroppedImage = () => {
    if (!imageSrc || !imageRef.current || !canvasRef.current) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      // Create output canvas directly
      const outputCanvas = document.createElement('canvas');
      const outputCtx = outputCanvas.getContext('2d');
      if (!outputCtx) return;

      // Set final output dimensions to match profile display
      if (imageType === 'avatar') {
        outputCanvas.width = 400;
        outputCanvas.height = 400;
      } else {
        // Banner: Full-width crop for proper aspect ratio matching profile display
        // Profile banner is full-width x h-36, which is ~6-7:1 aspect
        // Using 720x120 (aspect 6:1) to better match final display
        outputCanvas.width = 1200;
        outputCanvas.height = 200; // 6:1 aspect ratio
      }

      // Get container dimensions from DOM
      const containerRect = canvasRef.current!.getBoundingClientRect();
      const containerWidth = containerRect.width;
      const containerHeight = containerRect.height;

      console.log('=== CROP DEBUG START ===');
      console.log('1. Container:', containerWidth, 'x', containerHeight);
      console.log('2. Image original:', img.width, 'x', img.height);
      console.log('3. Scale:', scale, 'Position:', position);

      // Calculate how image renders with object-fit: contain (before scale)
      const imgRatio = img.width / img.height;
      const containerRatio = containerWidth / containerHeight;
      
      let baseRenderWidth, baseRenderHeight;
      if (imgRatio > containerRatio) {
        baseRenderWidth = containerWidth;
        baseRenderHeight = containerWidth / imgRatio;
      } else {
        baseRenderHeight = containerHeight;
        baseRenderWidth = containerHeight * imgRatio;
      }

      console.log('4. Base render (before scale):', baseRenderWidth, 'x', baseRenderHeight);

      // Apply scale to get actual rendered size
      const actualRenderWidth = baseRenderWidth * scale;
      const actualRenderHeight = baseRenderHeight * scale;

      console.log('5. Actual render (after scale):', actualRenderWidth, 'x', actualRenderHeight);

      // Calculate image position in viewport (centered + offset)
      const imgX = (containerWidth - actualRenderWidth) / 2 + position.x;
      const imgY = (containerHeight - actualRenderHeight) / 2 + position.y;

      console.log('6. Image position in viewport:', imgX, imgY);

      // Define crop area dimensions (in viewport pixels) - FIXED
      let cropWidth, cropHeight;
      if (imageType === 'avatar') {
        cropWidth = 360;
        cropHeight = 360;
      } else {
        cropWidth = 720; // Match the visual crop frame
        cropHeight = 120;
      }

      // Crop area position (centered in container)
      const cropX = (containerWidth - cropWidth) / 2;
      const cropY = (containerHeight - cropHeight) / 2;

      console.log('7. Crop area:', cropWidth, 'x', cropHeight, 'at position', cropX, cropY);

      // Calculate what part of the SCALED/RENDERED image is visible in crop area
      // This is in VIEWPORT coordinates
      const cropRelativeX = cropX - imgX;
      const cropRelativeY = cropY - imgY;

      console.log('8. Crop relative to rendered image (viewport px):', cropRelativeX, cropRelativeY);

      // Convert from VIEWPORT (scaled) coordinates to ORIGINAL IMAGE coordinates
      // Scale factor: original / rendered
      const scaleToOriginal = img.width / actualRenderWidth;

      console.log('9. Scale to original factor:', scaleToOriginal);

      // Calculate source rectangle in ORIGINAL image coordinates
      let sourceX = cropRelativeX * scaleToOriginal;
      let sourceY = cropRelativeY * scaleToOriginal;
      const sourceWidth = cropWidth * scaleToOriginal;
      const sourceHeight = cropHeight * scaleToOriginal;

      console.log('10. Source from original (RAW calc):', sourceX, sourceY, sourceWidth, 'x', sourceHeight);
      
      // NO MORE ADJUSTMENT - let's see what we get without it
      console.log('11. Final source rect:', sourceX, sourceY, sourceWidth, 'x', sourceHeight);
      console.log('12. Output canvas:', outputCanvas.width, 'x', outputCanvas.height);
      console.log('13. Aspect ratios - Crop:', (cropWidth/cropHeight).toFixed(2), 'Output:', (outputCanvas.width/outputCanvas.height).toFixed(2), 'Source:', (sourceWidth/sourceHeight).toFixed(2));
      console.log('=== CROP DEBUG END ===');

      // For avatar, apply circular clipping
      if (imageType === 'avatar') {
        outputCtx.save();
        outputCtx.beginPath();
        outputCtx.arc(outputCanvas.width / 2, outputCanvas.height / 2, outputCanvas.width / 2, 0, Math.PI * 2);
        outputCtx.closePath();
        outputCtx.clip();
      }

      // Draw cropped portion from original image to output canvas
      outputCtx.drawImage(
        img,
        sourceX, sourceY, sourceWidth, sourceHeight,  // Source rect from original
        0, 0, outputCanvas.width, outputCanvas.height  // Dest rect on output
      );

      if (imageType === 'avatar') {
        outputCtx.restore();
      }

      // Export
      const dataUrl = outputCanvas.toDataURL('image/png', 0.95);
      
      if (imageType === 'avatar') {
        setUserAvatar(dataUrl);
      } else {
        setUserBanner(dataUrl);
      }
      
      // Reset and close
      setImageSrc(null);
      setImageType(null);
      resetAll();
    };

    img.onerror = (e) => {
      console.error('Failed to load image:', e);
      alert('Failed to load image. Please try again.');
    };

    img.src = imageSrc;
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-start sm:items-center justify-center overflow-y-auto z-50 p-3 sm:p-4"
      onClick={onClose}
    >
      <div 
        className="bg-gradient-to-br from-[#1e2230] via-[#242836] to-[#1a1d29] rounded-2xl max-w-5xl w-full relative border border-white/10 shadow-2xl shadow-[#00d4ff]/10 overflow-hidden max-h-[95vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-white/60 hover:text-white transition-all z-10 bg-black/30 hover:bg-black/50 backdrop-blur-sm rounded-full p-1.5"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Banner */}
        <div 
          className="h-36 relative bg-cover bg-center flex-shrink-0 group cursor-pointer"
          style={{
            backgroundImage: userBanner 
              ? `url(${userBanner})` 
              : 'linear-gradient(135deg, #00d4ff 0%, #00b8e6 50%, #0891b2 100%)'
          }}
          onClick={() => bannerInputRef.current?.click()}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#1e2230]/60" />
          
          {/* Banner Edit Button */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
            <div className="bg-white/10 backdrop-blur-md rounded-lg px-3 py-2 border border-white/20 flex items-center gap-2">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-white text-xs font-medium">Change Banner</span>
            </div>
          </div>
          
          <input
            ref={bannerInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const img = new Image();
                img.onload = () => {
                  // Check minimum dimensions for banner
                  if (img.width < 800 || img.height < 250) {
                    alert(`Banner image must be at least 800x250px. Your image is ${img.width}x${img.height}px.`);
                    return;
                  }
                  setImageSrc(URL.createObjectURL(file));
                  setImageType('banner');
                };
                img.src = URL.createObjectURL(file);
              }
            }}
            className="hidden"
          />
          
          <div className="absolute -bottom-8 left-5">
            <div 
              className="relative group/avatar cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                avatarInputRef.current?.click();
              }}
            >
              {userAvatar ? (
                <div className="w-24 h-24 rounded-full border-4 border-[#1e2230] shadow-xl shadow-black/50 overflow-hidden ring-2 ring-[#00d4ff]/30">
                  <img src={userAvatar} alt="Avatar" className="w-full h-full object-cover" />
                  
                  {/* Avatar Edit Overlay */}
                  <div className="absolute inset-0 bg-black/70 opacity-0 group-hover/avatar:opacity-100 transition-all flex items-center justify-center rounded-full">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                </div>
              ) : (
                <div className="w-24 h-24 bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 rounded-full border-4 border-[#1e2230] flex items-center justify-center shadow-xl shadow-black/50 ring-2 ring-[#00d4ff]/30">
                  <span className="text-white text-2xl font-bold">{userName.slice(0, 2).toUpperCase()}</span>
                  
                  {/* Avatar Edit Overlay */}
                  <div className="absolute inset-0 bg-black/70 opacity-0 group-hover/avatar:opacity-100 transition-all flex items-center justify-center rounded-full">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                </div>
              )}
              
              <input
                ref={avatarInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setImageSrc(URL.createObjectURL(file));
                    setImageType('avatar');
                  }
                }}
                className="hidden"
              />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 px-5 pt-12 pb-2 border-b border-white/5 flex-shrink-0 bg-gradient-to-b from-transparent to-white/[0.02]">
          <button
            onClick={() => setProfileTab("overview")}
            className={`px-4 py-2 text-xs font-medium transition-all relative rounded-t-lg ${
              profileTab === "overview"
                ? "text-[#00d4ff] bg-white/5"
                : "text-white/60 hover:text-white/80 hover:bg-white/[0.02]"
            }`}
          >
            Overview
            {profileTab === "overview" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#00d4ff] to-[#00b8e6]" />
            )}
          </button>
          <button
            onClick={() => setProfileTab("settings")}
            className={`px-4 py-2 text-xs font-medium transition-all relative rounded-t-lg ${
              profileTab === "settings"
                ? "text-[#00d4ff] bg-white/5"
                : "text-white/60 hover:text-white/80 hover:bg-white/[0.02]"
            }`}
          >
            Settings
            {profileTab === "settings" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#00d4ff] to-[#00b8e6]" />
            )}
          </button>
        </div>

        {/* Profile Content - Scrollable */}
        <div className={`flex-1 px-5 pb-3 ${profileTab === "settings" ? "overflow-y-auto" : ""}`}>
          {profileTab === "overview" ? (
            <div className="max-w-full overflow-y-auto max-h-[calc(100vh-320px)] pr-1">
              {/* User Info */}
              <div className="mb-3 mt-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h2 className="text-white text-xl font-semibold">{userName}</h2>
                      {hasPremium && (
                        <div className="px-2 py-1 bg-gradient-to-r from-[#c89b3c] to-[#00d4ff] rounded-md flex items-center gap-1">
                          <Crown className="w-3.5 h-3.5 text-white" />
                          <span className="text-white font-bold text-xs">FinderQ</span>
                        </div>
                      )}
                      {/* Status Selector */}
                      <button
                        onClick={() => {
                          const statuses: Array<'online' | 'busy' | 'offline'> = ['online', 'busy', 'offline'];
                          const currentIndex = statuses.indexOf(userStatus);
                          const nextStatus = statuses[(currentIndex + 1) % statuses.length];
                          onStatusChange(nextStatus);
                        }}
                        className="flex items-center gap-1 transition-all hover:scale-110 cursor-pointer relative top-1 -left-3"
                      >
                        <img
                          src={userStatus === 'online' ? statusOnline : userStatus === 'busy' ? statusBusy : statusOffline}
                          alt={userStatus === 'online' ? 'Online' : userStatus === 'busy' ? 'Busy' : 'Invisible'}
                          className="w-10 h-10 rounded-full aspect-square object-cover"
                        />
                      </button>
                    </div>
                    <p className="text-white/50 text-xs">{userEmail}</p>
                    {/* Join Date */}
                    {userJoinDate && (
                      <p className="text-white/40 text-xs mt-0.5">
                        Joined {(() => {
                          const date = new Date(userJoinDate);
                          const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                          return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
                        })()}
                      </p>
                    )}
                  </div>
                </div>
                {tournamentEarnings !== undefined && tournamentEarnings >= 5 && (
                  <div className="-mt-10 mb-2">
                    <TrophyBadge earnings={tournamentEarnings} size="small" showAmount={true} offsetX="60px" />
                  </div>
                )}

                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="px-2 py-0.5 bg-[#00d4ff]/10 text-[#00d4ff] rounded-md text-[10px] border border-[#00d4ff]/20 font-medium">
                    {userRegion.toUpperCase()} - {userRegion === 'euw' ? 'Europe West' : userRegion === 'eune' ? 'Europe Nordic & East' : 'Region'}
                  </span>
                  {isOwner && (
                    <span className="px-2 py-0.5 bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-600 text-white rounded-md text-[10px] border border-yellow-500/30 flex items-center gap-1 shadow-lg shadow-yellow-500/20 font-medium">
                      <Crown className="w-2.5 h-2.5" />
                      Owner
                    </span>
                  )}
                  {isAdmin && !isOwner && (
                    <span className="px-2 py-0.5 bg-gradient-to-r from-[#c89b3c] to-[#a67c2f] text-white rounded-md text-[10px] border border-[#c89b3c]/30 flex items-center gap-1 shadow-lg shadow-[#c89b3c]/20 font-medium">
                      <Shield className="w-2.5 h-2.5" />
                      Admin
                    </span>
                  )}
                </div>
              </div>

              {/* Profile Sections */}
              <div className="space-y-1.5">
                {/* Riot Account Connection */}
                <div className="bg-gradient-to-br from-[#1a1d29]/80 to-[#151821]/60 backdrop-blur-sm rounded-lg p-2.5 border border-[#00d4ff]/20 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-[#00d4ff]/5 rounded-full -translate-y-12 translate-x-12"></div>
                  <div className="relative">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-7 h-7 bg-[#00d4ff]/10 rounded-lg flex items-center justify-center ring-1 ring-[#00d4ff]/20">
                        <svg className="w-3.5 h-3.5 text-[#00d4ff]" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5zm0 2.18l8 4V17c0 4.52-2.98 8.69-7 9.93-4.02-1.24-7-5.41-7-9.93V8.18l6-3zM11 7v2h2V7h-2zm0 4v6h2v-6h-2z"/>
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-white/90 text-xs font-semibold">Riot Account</h3>
                        <p className="text-white/40 text-[10px]">Connect for verified stats</p>
                      </div>
                    </div>
                    
                    {riotAccountLinked && riotProfileData ? (
                      <div className="space-y-2">
                        {/* Status Banner */}
                        {riotDataIsReal ? (
                          <div className="flex items-center justify-between py-1.5 px-2 bg-green-500/10 rounded-md border border-green-500/20">
                            <div className="flex items-center gap-1.5">
                              <svg className="w-3.5 h-3.5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                              <span className="text-green-400 text-[10px] font-medium">Real Account • Live Stats</span>
                            </div>
                          </div>
                        ) : (
                          <div className="py-1.5 px-2 bg-orange-500/10 rounded-md border border-orange-500/20">
                            <div className="flex items-center gap-1.5 mb-0.5">
                              <svg className="w-3.5 h-3.5 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                              <span className="text-orange-400 text-[10px] font-medium">Demo Mode • Not Your Real Account</span>
                            </div>
                            <p className="text-orange-300/70 text-[9px] ml-5">
                              Get FREE Riot API key → Check <strong>/HOW_TO_GET_RIOT_API_KEY.md</strong>
                            </p>
                          </div>
                        )}
                        <div className="space-y-1.5">
                          <div className="flex justify-between items-center py-1">
                            <span className="text-white/50 text-[10px]">Riot ID</span>
                            <span className="text-white text-[10px] font-medium">{riotProfileData.summoner?.riotId || riotSummonerName}</span>
                          </div>
                          <div className="flex justify-between items-center py-1">
                            <span className="text-white/50 text-[10px]">Region</span>
                            <span className="text-[#00d4ff] text-[10px] font-medium">{riotLinkedRegion?.toUpperCase() || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between items-center py-1">
                            <span className="text-white/50 text-[10px]">Level</span>
                            <span className="text-white text-[10px] font-medium">{riotProfileData.summoner?.summonerLevel || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between items-center py-1">
                            <span className="text-white/50 text-[10px]">Rank</span>
                            <span className="text-[#00d4ff] text-[10px] font-medium">{riotProfileData.stats?.rank || 'Unranked'}</span>
                          </div>
                        </div>
                        <button 
                          onClick={() => {
                            setRiotAccountLinked(false);
                            setRiotProfileData(null);
                            setRiotDataIsReal(false);
                            setRiotSummonerName('');
                            setRiotLinkedRegion(null);
                            setUserRank(null); // Reset rank when disconnecting
                          }}
                          className="w-full py-1.5 bg-white/5 hover:bg-white/10 text-white/80 rounded-md transition-colors text-xs font-medium"
                        >
                          Disconnect
                        </button>
                      </div>
                    ) : (
                      <div>
                        <p className="text-white/50 text-[10px] mb-2">
                          Link your League of Legends account to display verified stats and rank.
                        </p>
                        <button 
                          onClick={() => {
                            setRiotSelectedRegion(userRegion as "euw" | "eune");
                            setIsRiotSyncOpen(true);
                          }}
                          className="w-full py-2 bg-gradient-to-r from-[#00d4ff] to-[#00b8e6] text-white rounded-lg hover:from-[#00b8e6] hover:to-[#009ac7] transition-all shadow-lg flex items-center justify-center gap-1.5 text-xs font-medium"
                        >
                          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
                          </svg>
                          Connect Riot Account
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-full">
              {/* Settings Tab */}
              <div className="space-y-3 mt-3 pb-4">
                <h2 className="text-white text-base mb-3 font-semibold">Profile Settings</h2>

                {/* 1. EDIT ACCOUNT INFO */}
                <div className="bg-gradient-to-br from-[#1a1d29]/80 to-[#151821]/60 backdrop-blur-sm rounded-lg p-3 border border-white/5">
                  <h3 className="text-white/90 mb-3 text-sm font-semibold flex items-center gap-2">
                    <div className="w-1 h-4 bg-gradient-to-b from-[#00d4ff] to-[#c89b3c] rounded-full" />
                    Edit Account Information
                  </h3>
                  <div className="space-y-3">
                    {/* Username */}
                    <div>
                      <label className="text-white/60 text-xs block mb-1.5">Username</label>
                      <input
                        type="text"
                        value={editUsername}
                        onChange={(e) => setEditUsername(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#00d4ff]/50 focus:ring-1 focus:ring-[#00d4ff]/30 transition-all"
                        placeholder="Enter username"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="text-white/60 text-xs block mb-1.5">Email Address</label>
                      <input
                        type="email"
                        value={editEmail}
                        onChange={(e) => setEditEmail(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#00d4ff]/50 focus:ring-1 focus:ring-[#00d4ff]/30 transition-all"
                        placeholder="Enter email"
                      />
                    </div>

                    {/* Region - Read Only (Set via Riot Account) */}
                    <div>
                      <label className="text-white/60 text-xs block mb-1.5">Region</label>
                      <div className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white/70 text-sm flex items-center justify-between">
                        <span>{userRegion.toUpperCase()} - {userRegion === 'euw' ? 'Europe West' : 'Europe Nordic & East'}</span>
                        <span className="text-[#00d4ff] text-xs">Set via Riot Account</span>
                      </div>
                    </div>

                    {/* Save/Cancel Buttons */}
                    {hasUnsavedChanges && (
                      <div className="flex gap-2 pt-2">
                        <button
                          onClick={discardAccountChanges}
                          className="flex-1 py-2 bg-white/5 hover:bg-white/10 text-white/80 rounded-lg transition-all text-xs font-medium"
                        >
                          Discard Changes
                        </button>
                        <button
                          onClick={saveAccountChanges}
                          className="flex-1 py-2 bg-gradient-to-r from-[#00d4ff] to-[#00b8e6] text-white rounded-lg hover:from-[#00b8e6] hover:to-[#009ac7] transition-all shadow-lg shadow-[#00d4ff]/20 text-xs font-medium"
                        >
                          Save Changes
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* 2. CHANGE PASSWORD */}
                <div className="bg-gradient-to-br from-[#1a1d29]/80 to-[#151821]/60 backdrop-blur-sm rounded-lg p-3 border border-white/5">
                  <h3 className="text-white/90 mb-3 text-sm font-semibold flex items-center gap-2">
                    <div className="w-1 h-4 bg-gradient-to-b from-red-500 to-orange-500 rounded-full" />
                    Change Password
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-white/60 text-xs block mb-1.5">Current Password</label>
                      <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#00d4ff]/50 focus:ring-1 focus:ring-[#00d4ff]/30 transition-all"
                        placeholder="Enter current password"
                      />
                    </div>
                    <div>
                      <label className="text-white/60 text-xs block mb-1.5">New Password</label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#00d4ff]/50 focus:ring-1 focus:ring-[#00d4ff]/30 transition-all"
                        placeholder="Enter new password (min. 8 characters)"
                      />
                    </div>
                    <div>
                      <label className="text-white/60 text-xs block mb-1.5">Confirm New Password</label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#00d4ff]/50 focus:ring-1 focus:ring-[#00d4ff]/30 transition-all"
                        placeholder="Confirm new password"
                      />
                    </div>
                    <button
                      onClick={changePassword}
                      className="w-full py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all shadow-lg shadow-orange-500/20 text-xs font-medium"
                    >
                      Update Password
                    </button>
                  </div>
                </div>

                {/* 3. PRIVACY SETTINGS */}
                <div className="bg-gradient-to-br from-[#1a1d29]/80 to-[#151821]/60 backdrop-blur-sm rounded-lg p-3 border border-white/5">
                  <h3 className="text-white/90 mb-3 text-sm font-semibold flex items-center gap-2">
                    <div className="w-1 h-4 bg-gradient-to-b from-purple-500 to-pink-500 rounded-full" />
                    Privacy Settings
                  </h3>
                  <div className="space-y-3">
                    {/* Profile Visibility */}
                    <div className="flex items-center justify-between py-2">
                      <div>
                        <p className="text-white text-sm font-medium">Profile Visibility</p>
                        <p className="text-white/50 text-xs">Who can see your profile</p>
                      </div>
                      <select
                        value={profileVisibility}
                        onChange={(e) => setProfileVisibility(e.target.value as 'public' | 'private')}
                        className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-white text-xs focus:outline-none focus:border-[#00d4ff]/50 cursor-pointer"
                      >
                        <option value="public" className="bg-[#1e2230]">Public</option>
                        <option value="private" className="bg-[#1e2230]">Private</option>
                      </select>
                    </div>

                    {/* Show Online Status */}
                    <div className="flex items-center justify-between py-2">
                      <div>
                        <p className="text-white text-sm font-medium">Show Online Status</p>
                        <p className="text-white/50 text-xs">Let others see when you're online</p>
                      </div>
                      <button
                        onClick={() => setShowOnlineStatus(!showOnlineStatus)}
                        className={`relative w-11 h-6 rounded-full transition-all ${
                          showOnlineStatus ? 'bg-[#00d4ff]' : 'bg-white/10'
                        }`}
                      >
                        <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                          showOnlineStatus ? 'translate-x-5' : 'translate-x-0'
                        }`} />
                      </button>
                    </div>

                    {/* Accept Messages From */}
                    <div className="flex items-center justify-between py-2 border-t border-white/5">
                      <div>
                        <p className="text-white text-sm font-medium">Accept Messages From</p>
                        <p className="text-white/50 text-xs">Who can send you messages</p>
                      </div>
                      <select
                        value={acceptMessagesFrom}
                        onChange={(e) => setAcceptMessagesFrom(e.target.value as 'everyone' | 'friends')}
                        className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-white text-xs focus:outline-none focus:border-[#00d4ff]/50 cursor-pointer"
                      >
                        <option value="everyone" className="bg-[#1e2230]">Everyone</option>
                        <option value="friends" className="bg-[#1e2230]">Friends Only</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* 4. NOTIFICATION SETTINGS */}
                <div className="bg-gradient-to-br from-[#1a1d29]/80 to-[#151821]/60 backdrop-blur-sm rounded-lg p-3 border border-white/5">
                  <h3 className="text-white/90 mb-3 text-sm font-semibold flex items-center gap-2">
                    <div className="w-1 h-4 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-full" />
                    Notification Settings
                  </h3>
                  <div className="space-y-3">
                    {/* Email Notifications */}
                    <div className="flex items-center justify-between py-2">
                      <div>
                        <p className="text-white text-sm font-medium">Email Notifications</p>
                        <p className="text-white/50 text-xs">Receive updates via email</p>
                      </div>
                      <button
                        onClick={() => setEmailNotifications(!emailNotifications)}
                        className={`relative w-11 h-6 rounded-full transition-all ${
                          emailNotifications ? 'bg-[#00d4ff]' : 'bg-white/10'
                        }`}
                      >
                        <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                          emailNotifications ? 'translate-x-5' : 'translate-x-0'
                        }`} />
                      </button>
                    </div>

                    {/* New Message Notifications */}
                    <div className="flex items-center justify-between py-2 border-t border-white/5">
                      <div>
                        <p className="text-white text-sm font-medium">New Messages</p>
                        <p className="text-white/50 text-xs">Notify when you receive messages</p>
                      </div>
                      <button
                        onClick={() => setNewMessageNotifications(!newMessageNotifications)}
                        className={`relative w-11 h-6 rounded-full transition-all ${
                          newMessageNotifications ? 'bg-[#00d4ff]' : 'bg-white/10'
                        }`}
                      >
                        <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                          newMessageNotifications ? 'translate-x-5' : 'translate-x-0'
                        }`} />
                      </button>
                    </div>

                    {/* System Updates */}
                    <div className="flex items-center justify-between py-2 border-t border-white/5">
                      <div>
                        <p className="text-white text-sm font-medium">System Updates</p>
                        <p className="text-white/50 text-xs">Receive platform announcements</p>
                      </div>
                      <button
                        onClick={() => setSystemUpdates(!systemUpdates)}
                        className={`relative w-11 h-6 rounded-full transition-all ${
                          systemUpdates ? 'bg-[#00d4ff]' : 'bg-white/10'
                        }`}
                      >
                        <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                          systemUpdates ? 'translate-x-5' : 'translate-x-0'
                        }`} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* 5. SECURITY SETTINGS */}
                <div className="bg-gradient-to-br from-[#1a1d29]/80 to-[#151821]/60 backdrop-blur-sm rounded-lg p-3 border border-white/5">
                  <h3 className="text-white/90 mb-3 text-sm font-semibold flex items-center gap-2">
                    <div className="w-1 h-4 bg-gradient-to-b from-green-500 to-emerald-500 rounded-full" />
                    Security Settings
                  </h3>
                  <div className="space-y-3">
                    {/* Two-Factor Authentication */}
                    <div className="flex items-center justify-between py-2">
                      <div>
                        <p className="text-white text-sm font-medium">Two-Factor Authentication</p>
                        <p className="text-white/50 text-xs">Add extra security to your account</p>
                      </div>
                      <button
                        onClick={() => {
                          setTwoFactorEnabled(!twoFactorEnabled);
                          alert(twoFactorEnabled ? '2FA disabled' : '2FA enabled! (Demo)');
                        }}
                        className={`relative w-11 h-6 rounded-full transition-all ${
                          twoFactorEnabled ? 'bg-green-500' : 'bg-white/10'
                        }`}
                      >
                        <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                          twoFactorEnabled ? 'translate-x-5' : 'translate-x-0'
                        }`} />
                      </button>
                    </div>

                    {/* Active Sessions */}
                    <div className="py-2 border-t border-white/5">
                      <p className="text-white text-sm font-medium mb-1">Active Sessions</p>
                      <p className="text-white/50 text-xs mb-2">Manage devices logged into your account</p>
                      <button className="w-full py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-all text-xs font-medium flex items-center justify-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        View Active Sessions (1)
                      </button>
                    </div>

                    {/* Login History */}
                    <div className="py-2 border-t border-white/5">
                      <p className="text-white text-sm font-medium mb-1">Login History</p>
                      <p className="text-white/50 text-xs mb-2">Review recent login activity</p>
                      <button className="w-full py-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-all text-xs font-medium flex items-center justify-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        View Login History
                      </button>
                    </div>
                  </div>
                </div>

                {/* 6. DANGER ZONE */}
                <div className="bg-gradient-to-br from-red-900/20 to-red-950/20 backdrop-blur-sm rounded-lg p-3 border border-red-500/20">
                  <h3 className="text-red-400 mb-3 text-sm font-semibold flex items-center gap-2">
                    <div className="w-1 h-4 bg-gradient-to-b from-red-500 to-red-700 rounded-full" />
                    Danger Zone
                  </h3>
                  <div className="space-y-3">
                    {/* Deactivate Account */}
                    <div className="py-2">
                      <p className="text-white text-sm font-medium mb-1">Deactivate Account</p>
                      <p className="text-white/50 text-xs mb-2">Temporarily disable your account</p>
                      <button className="w-full py-2 bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/30 rounded-lg transition-all text-xs font-medium">
                        Deactivate Account
                      </button>
                    </div>

                    {/* Delete Account */}
                    <div className="py-2 border-t border-red-500/20">
                      <p className="text-white text-sm font-medium mb-1">Delete Account</p>
                      <p className="text-white/50 text-xs mb-2">Permanently delete your account and all data</p>
                      <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="w-full py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg transition-all text-xs font-medium"
                      >
                        Delete Account Permanently
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-start sm:items-center justify-center overflow-y-auto z-[60] p-3 sm:p-4">
            <div 
              className="bg-gradient-to-br from-[#1e2230] via-[#242836] to-[#1a1d29] rounded-2xl max-w-md w-full relative border border-red-500/30 shadow-2xl shadow-red-500/20 p-5"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/20">
                  <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <h3 className="text-white text-lg font-semibold mb-2">Delete Account?</h3>
                <p className="text-white/60 text-sm mb-6">
                  This action is <strong className="text-red-400">permanent</strong> and cannot be undone. All your data, posts, and messages will be deleted forever.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-all text-sm font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteAccount}
                    className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all shadow-lg shadow-red-500/20 text-sm font-medium"
                  >
                    Delete Forever
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Cropper Modal */}
        {imageSrc && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-start sm:items-center justify-center overflow-y-auto z-[60] p-3 sm:p-4">
            <div 
              className="bg-gradient-to-br from-[#1e2230] via-[#242836] to-[#1a1d29] rounded-2xl max-w-3xl w-full relative border border-white/10 shadow-2xl shadow-[#00d4ff]/10 overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <div>
                  <h3 className="text-white text-sm font-semibold">Adjust {imageType === 'avatar' ? 'Avatar' : 'Banner'}</h3>
                  <p className="text-white/50 text-xs">Drag to reposition, use slider to zoom</p>
                </div>
                <button
                  onClick={() => {
                    setImageSrc(null);
                    setImageType(null);
                    setScale(1);
                    setPosition({ x: 0, y: 0 });
                  }}
                  className="text-white/60 hover:text-white transition-all bg-white/5 hover:bg-white/10 backdrop-blur-sm rounded-full p-1.5"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Cropper Area */}
              <div 
                ref={canvasRef}
                className="relative h-[450px] bg-gradient-to-br from-black/80 to-[#0a0e1a]/90 overflow-hidden flex items-center justify-center"
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                {/* Image */}
                <img
                  ref={imageRef}
                  src={imageSrc}
                  alt="Crop preview"
                  className="max-w-full max-h-full object-contain select-none transition-transform duration-75"
                  style={{
                    transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px) rotate(${rotation}deg) scaleX(${flipH ? -1 : 1}) scaleY(${flipV ? -1 : 1})`,
                    cursor: isDragging ? 'grabbing' : 'grab',
                    transformOrigin: 'center center',
                    filter: `brightness(${brightness}%) contrast(${contrast}%)`
                  }}
                  onMouseDown={handleMouseDown}
                  draggable={false}
                />
                
                {/* Crop Grid Overlay */}
                <div className="absolute inset-0 pointer-events-none">
                  {imageType === 'avatar' ? (
                    /* Circular crop overlay for avatar */
                    <div className="absolute inset-0 flex items-center justify-center">
                      {/* Dark overlay with circular cutout */}
                      <div className="absolute inset-0 bg-black/50" style={{
                        WebkitMaskImage: 'radial-gradient(circle, transparent 180px, black 180px)',
                        maskImage: 'radial-gradient(circle, transparent 180px, black 180px)'
                      }} />
                      
                      {/* Circular border */}
                      <div className="w-[360px] h-[360px] rounded-full border-2 border-[#00d4ff]/50 shadow-lg shadow-[#00d4ff]/30"></div>
                    </div>
                  ) : (
                    /* Rectangle crop frame for banner - 720x120 for 6:1 aspect */
                    <div className="absolute inset-0 flex items-center justify-center">
                      {/* Crop Frame - 720x120 (6:1 aspect) to match profile banner display */}
                      <div className="w-[720px] h-[120px] border-2 border-[#00d4ff]/50 rounded-lg relative z-10">
                        {/* Clear area inside crop + dark outside */}
                        <div className="absolute inset-0 bg-transparent" style={{
                          boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5), 0 0 20px rgba(0, 212, 255, 0.3)'
                        }}></div>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Info Bar */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between bg-black/60 backdrop-blur-md rounded-lg px-3 py-2 border border-white/10">
                  <div className="flex items-center gap-3">
                    <span className="text-white/70 text-xs">
                      {Math.round(scale * 100)}% zoom
                    </span>
                    <span className="text-white/40 text-xs">•</span>
                    <span className="text-white/70 text-xs">
                      {rotation}° rotation
                    </span>
                  </div>
                  <button
                    onClick={() => setShowGrid(!showGrid)}
                    className={`px-2 py-1 rounded text-xs transition-all ${
                      showGrid 
                        ? 'bg-[#00d4ff]/20 text-[#00d4ff] border border-[#00d4ff]/30' 
                        : 'bg-white/5 text-white/50 border border-white/10 hover:bg-white/10'
                    }`}
                  >
                    Grid
                  </button>
                </div>
              </div>

              {/* Advanced Controls */}
              <div className="p-4 border-t border-white/10 space-y-3">
                {/* Zoom Slider - SIMPLU CA LA DISCORD */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-white text-sm font-medium">Zoom</label>
                    <span className="text-[#00d4ff] text-sm font-semibold">{Math.round(scale * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    value={scale}
                    min={minScale}
                    max={3}
                    step={0.05}
                    onChange={(e) => setScale(Number(e.target.value))}
                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#00d4ff] [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-[#00d4ff]/30 [&::-webkit-slider-thumb]:hover:bg-[#00b8e6]"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => {
                      setImageSrc(null);
                      setImageType(null);
                      resetAll();
                    }}
                    className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-all text-sm font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveCroppedImage}
                    className="flex-1 py-3 bg-[#00d4ff] hover:bg-[#00b8e6] text-white rounded-lg transition-all shadow-lg shadow-[#00d4ff]/20 text-sm font-medium"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}