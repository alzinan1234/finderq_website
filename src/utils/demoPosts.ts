// @ts-nocheck
// Demo posts data for all regions

const ensureUniqueIds = (posts: any[]) => {
  const seenIds = new Set<number>();
  return posts.map((post) => {
    if (seenIds.has(post.id)) {
      // Find a new unique ID
      let newId = posts.length > 0 ? Math.max(...posts.map(p => p.id)) + 1 : 1;
      while (seenIds.has(newId)) {
        newId++;
      }
      console.warn(`🔧 Fixed duplicate ID ${post.id} → ${newId} for user ${post.username}`);
      seenIds.add(newId);
      return { ...post, id: newId };
    } else {
      seenIds.add(post.id);
      return post;
    }
  });
};

const generateRandomJoinDate = () => {
  const now = new Date();
  const daysAgo = Math.floor(Math.random() * (365 * 3 - 180)) + 180;
  const joinDate = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
  return joinDate.toISOString().split('T')[0];
};

const addJoinDatesToPosts = (posts: any[]) => {
  return posts.map(post => ({
    ...post,
    joinDate: post.joinDate || generateRandomJoinDate()
  }));
};

const initialPostsEUNE = [
  {
    id: 1,
    initials: "BW",
    color: "from-[#cd7f32] to-[#8b4513]",
    username: "BronzeWarrior",
    time: "acum 1 min",
    content: "Bronze 2 jungle main, învăț să joc Lee Sin. Caut echipă care să nu mă flame, vreau doar să mă îmbunătățesc!",
    tags: [
      { text: "Bronze II", bg: "bg-white/5", color: "text-white/70" },
      { text: "Jungle", bg: "bg-white/5", color: "text-white/70" },
      { text: "Ranked Solo/Duo", bg: "bg-white/5", color: "text-white/70" }
    ],
    riotVerified: true,
    language: "ro",
    userLanguages: ["ro"],
    rank: "Bronze II",
    lp: 45
  },
  {
    id: 2,
    initials: "IW",
    color: "from-[#6b5d56] to-[#4a3f3a]",
    username: "IronWarrior",
    time: "acum 2 min",
    content: "Sunt nou în ranked, Iron 3 și învăț să joc support. Caut echipă prietenoasă care să aibă răbdare cu mine!",
    tags: [
      { text: "Iron III", bg: "bg-white/5", color: "text-white/70" },
      { text: "Ranked Solo/Duo", bg: "bg-white/5", color: "text-white/70" }
    ],
    riotVerified: false,
    language: "ro",
    userLanguages: ["ro"]
  },
  {
    id: 3,
    initials: "EG",
    color: "from-emerald-500 to-green-500",
    username: "EmeraldGamer",
    time: "acum 5 min",
    content: "Emerald 2 mid main, caut jungle pentru duo ranked. Prefer champions engage și comunicare bună pe Discord!",
    tags: [
      { text: "Emerald II", bg: "bg-white/5", color: "text-white/70" },
      { text: "Ranked Solo/Duo", bg: "bg-white/5", color: "text-white/70" }
    ],
    riotVerified: false,
    language: "ro",
    userLanguages: ["ro"]
  },
  {
    id: 4,
    initials: "AD",
    color: "from-[#00d4ff] to-[#00b8e6]",
    username: "AlexDarius",
    time: "acum 10 min",
    content: "Caut support pentru ranked, sunt Gold 2 ADC main. Prefer să joc seri 20:00-00:00. Add me: AlexDarius#EUNE",
    tags: [
      { text: "Gold II", bg: "bg-white/5", color: "text-white/70" },
      { text: "ADC", bg: "bg-white/5", color: "text-white/70" },
      { text: "Ranked Solo/Duo", bg: "bg-white/5", color: "text-white/70" }
    ],
    riotVerified: true,
    language: "ro",
    userLanguages: ["ro"],
    lp: 89,
    avatar: "https://images.unsplash.com/photo-1759701546655-d90ec831aa52?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBwb3J0cmFpdCUyMGVzcG9ydHMlMjBwbGF5ZXJ8ZW58MXx8fHwxNzczNDMwNDM3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    banner: "https://images.unsplash.com/photo-1766051666522-9cfa12675f5b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBzZXR1cCUyMG5lb24lMjBsaWdodHMlMjBwdXJwbGV8ZW58MXx8fHwxNzczNDMwNDM5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    rank: "Gold II"
  },
  {
    id: 5,
    initials: "MG",
    color: "from-purple-500 to-pink-500",
    username: "MidGodess",
    time: "acum 25 min",
    content: "Echipă de 5 caută jungler Platinum+. Jucăm turnee și clash. Comunicare Discord obligatorie!",
    tags: [
      { text: "Platinum III", bg: "bg-white/5", color: "text-white/70" },
      { text: "Clash", bg: "bg-white/5", color: "text-white/70" }
    ],
    riotVerified: false,
    language: "ro",
    userLanguages: ["ro"],
    avatar: "https://images.unsplash.com/photo-1628501899963-43bb8e2423e1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmZW1hbGUlMjBnYW1lciUyMHBvcnRyYWl0JTIwaGVhZHBob25lc3xlbnwxfHx8fDE3NzM0MzA0Mzh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    banner: "https://images.unsplash.com/photo-1769704552351-d5059b8bb6f9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMGdyYWRpZW50JTIwYmx1ZSUyMHB1cnBsZXxlbnwxfHx8fDE3NzM0MzA0NDB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  },
  {
    id: 6,
    initials: "TP",
    color: "from-green-500 to-emerald-500",
    username: "TopPlayer99",
    time: "acum 1 oră",
    content: "Silver 1 top laner, vreau să ajung Gold înainte de finalul sezonului. Caut duo calm și friendly!",
    tags: [
      { text: "Silver I", bg: "bg-white/5", color: "text-white/70" },
      { text: "Ranked Solo/Duo", bg: "bg-white/5", color: "text-white/70" }
    ],
    riotVerified: false,
    language: "ro",
    userLanguages: ["ro"]
  },
  {
    id: 7,
    initials: "CP",
    color: "from-cyan-500 to-blue-500",
    username: "CasualPlayer",
    time: "acum 30 min",
    content: "Caut echipă pentru jocuri normale și ARAM. Joc pentru fun, fără stres! Nu am contul conectat la Riot încă.",
    tags: [
      { text: "Normal Games", bg: "bg-white/5", color: "text-white/70" },
      { text: "ARAM", bg: "bg-white/5", color: "text-white/70" }
    ],
    riotVerified: false,
    language: "ro",
    userLanguages: ["ro"],
    avatar: "https://images.unsplash.com/photo-1655386528040-8e469309ef54?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXN1YWwlMjBnYW1lciUyMHBvcnRyYWl0JTIwaGVhZHBob25lc3xlbnwxfHx8fDE3NzM3NTg1NjB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    banner: "https://images.unsplash.com/photo-1769704552351-d5059b8bb6f9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibHVlJTIwcHVycGxlJTIwZ3JhZGllbnQlMjBhYnN0cmFjdHxlbnwxfHx8fDE3NzM2NDI2NDF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    bio: "Just here to have fun and meet new teammates! 🎮✨"
  },
  {
    id: 8,
    initials: "SL",
    color: "from-orange-500 to-red-500",
    username: "SupportLife",
    time: "acum 2 ore",
    content: "Diamond 4 support, joc Thresh, Nautilus, Leona. Caut ADC serios pentru ranked duo queue.",
    tags: [
      { text: "Diamond IV", bg: "bg-white/5", color: "text-white/70" },
      { text: "Support", bg: "bg-white/5", color: "text-white/70" },
      { text: "Ranked Solo/Duo", bg: "bg-white/5", color: "text-white/70" }
    ],
    riotVerified: true,
    language: "ro",
    userLanguages: ["ro"],
    avatar: "https://images.unsplash.com/photo-1571169186019-18acfb7036bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlc3BvcnRzJTIwZ2FtaW5nJTIwYXZhdGFyJTIwcHJvZmVzc2lvbmFsfGVufDF8fHx8MTc3MzQzMDQzOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    banner: "https://images.unsplash.com/photo-1765476450592-ad6ec11e312a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMGRhcmslMjBmYW50YXN5JTIwcHVycGxlfGVufDF8fHx8MTc3MzQzMDQ0M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    rank: "Diamond IV",
    lp: 34
  },
  {
    id: 9,
    initials: "MP",
    color: "from-purple-600 to-purple-800",
    username: "MasterPlayer",
    time: "acum 3 ore",
    content: "Master jungler caut echipă competitivă pentru turnee. Main Nidalee, Lee Sin, Graves. Experiență în clash și competiții!",
    tags: [
      { text: "Master", bg: "bg-white/5", color: "text-white/70" },
      { text: "Jungle", bg: "bg-white/5", color: "text-white/70" },
      { text: "Clash", bg: "bg-white/5", color: "text-white/70" }
    ],
    riotVerified: true,
    language: "ro",
    userLanguages: ["ro"],
    avatar: "https://images.unsplash.com/photo-1759701546655-d90ec831aa52?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBwb3J0cmFpdCUyMGVzcG9ydHMlMjBwbGF5ZXJ8ZW58MXx8fHwxNzczNDMwNDM3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    banner: "https://images.unsplash.com/photo-1628089700970-0012c5718efc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBrZXlib2FyZCUyMHJnYiUyMGxpZ2h0c3xlbnwxfHx8fDE3NzMzOTk5MjJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    rank: "Master",
    lp: 56
  },
  {
    id: 10,
    initials: "GM",
    color: "from-red-600 to-red-800",
    username: "GrandmasterADC",
    time: "acum 4 ore",
    content: "Grandmaster ADC căutând support pentru Top 200 Challenger push. Main Kai'Sa, Jinx, Aphelios. Joc zilnic 6+ ore, comunicare vocală obligatorie!",
    tags: [
      { text: "Grandmaster", bg: "bg-white/5", color: "text-white/70" },
      { text: "ADC", bg: "bg-white/5", color: "text-white/70" },
      { text: "Ranked Solo/Duo", bg: "bg-white/5", color: "text-white/70" }
    ],
    riotVerified: true,
    language: "ro",
    userLanguages: ["ro"],
    avatar: "https://images.unsplash.com/photo-1628501899963-43bb8e2423e1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmZW1hbGUlMjBnYW1lciUyMHBvcnRyYWl0JTIwaGVhZHBob25lc3xlbnwxfHx8fDE3NzM0MzA0Mzh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    banner: "https://images.unsplash.com/photo-1642537389593-cf3f195905d1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZW9uJTIwbGlnaHRzJTIwYWJzdHJhY3QlMjBiYWNrZ3JvdW5kfGVufDF8fHx8MTc3MzQzMDQ0M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    rank: "Grandmaster",
    lp: 78
  },
  {
    id: 11,
    initials: "CX",
    color: "from-yellow-500 to-orange-500",
    username: "ChallengerXpert",
    time: "acum 5 ore",
    content: "Challenger Top 50 mid laner căutând echipă profesionistă pentru scrimm-uri și competiții oficiale. Main Azir, Orianna, Syndra. Disponibil pentru discuții serioase despre contract!",
    tags: [
      { text: "Challenger", bg: "bg-white/5", color: "text-white/70" },
      { text: "Mid", bg: "bg-white/5", color: "text-white/70" },
      { text: "Clash", bg: "bg-white/5", color: "text-white/70" }
    ],
    riotVerified: true,
    language: "ro",
    userLanguages: ["ro"],
    avatar: "https://images.unsplash.com/photo-1759701546655-d90ec831aa52?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBwb3J0cmFpdCUyMGVzcG9ydHMlMjBwbGF5ZXJ8ZW58MXx8fHwxNzczNDMwNDM3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    banner: "https://images.unsplash.com/photo-1605727328079-f3115619d3a5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjeWJlcnB1bmslMjBuZW9uJTIwY2l0eSUyMGFic3RyYWN0fGVufDF8fHx8MTc3MzQzMDQzOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    rank: "Challenger",
    lp: 912,
    userNameColor: "from-[#ffd700] to-[#daa520]", // Gold gradient
    userProfileBackground: "from-[#1f1a0a] via-[#3e3314] to-[#1f1a0a]" // Gold background
  },
  // === DEMO PROFILES - All Ranks Verified ===
  // IRON - Verified
  {
    id: 101,
    initials: "IV",
    color: "from-[#6b5d56] to-[#4a3f3a]",
    username: "IronVerified",
    time: "acum 21 min",
    content: "Iron I verified player - learning the game! Looking for friendly team to improve together!",
    tags: [
      { text: "Iron I", bg: "bg-white/5", color: "text-white/70" },
      { text: "Top", bg: "bg-white/5", color: "text-white/70" },
      { text: "Ranked Solo/Duo", bg: "bg-white/5", color: "text-white/70" }
    ],
    riotVerified: true,
    language: "en",
    userLanguages: ["en"],
    rank: "Iron I",
    lp: 23,
    avatar: "https://images.unsplash.com/photo-1759701546655-d90ec831aa52?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBwb3J0cmFpdCUyMGVzcG9ydHMlMjBwbGF5ZXJ8ZW58MXx8fHwxNzczNDMwNDM3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    banner: "https://images.unsplash.com/photo-1628089700970-0012c5718efc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBrZXlib2FyZCUyMHJnYiUyMGxpZ2h0c3xlbnwxfHx8fDE3NzMzOTk5MjJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  },
  // SILVER - Verified
  {
    id: 102,
    initials: "SV",
    color: "from-[#c0c0c0] to-[#808080]",
    username: "SilverVerified",
    time: "acum 22 min",
    content: "Silver I verified mid laner. Main Ahri, Lux, Syndra. Looking for serious team to push for Gold!",
    tags: [
      { text: "Silver I", bg: "bg-white/5", color: "text-white/70" },
      { text: "Mid", bg: "bg-white/5", color: "text-white/70" },
      { text: "Ranked Solo/Duo", bg: "bg-white/5", color: "text-white/70" }
    ],
    riotVerified: true,
    language: "en",
    userLanguages: ["en"],
    rank: "Silver I",
    lp: 67,
    avatar: "https://images.unsplash.com/photo-1628501899963-43bb8e2423e1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmZW1hbGUlMjBnYW1lciUyMHBvcnRyYWl0JTIwaGVhZHBob25lc3xlbnwxfHx8fDE3NzM0MzA0Mzh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    banner: "https://images.unsplash.com/photo-1642537389593-cf3f195905d1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZW9uJTIwbGlnaHRzJTIwYWJzdHJhY3QlMjBiYWNrZ3JvdW5kfGVufDF8fHx8MTc3MzQzMDQ0M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  },
  // PLATINUM - Verified
  {
    id: 103,
    initials: "PV",
    color: "from-[#00d4ff] to-[#00b8e6]",
    username: "PlatinumVerified",
    time: "acum 23 min",
    content: "Platinum I verified support main. Main Thresh, Nautilus, Leona. Serious ADC duo needed for Diamond push!",
    tags: [
      { text: "Platinum I", bg: "bg-white/5", color: "text-white/70" },
      { text: "Support", bg: "bg-white/5", color: "text-white/70" },
      { text: "Ranked Solo/Duo", bg: "bg-white/5", color: "text-white/70" }
    ],
    riotVerified: true,
    language: "en",
    userLanguages: ["en"],
    rank: "Platinum I",
    lp: 55,
    avatar: "https://images.unsplash.com/photo-1571169186019-18acfb7036bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlc3BvcnRzJTIwZ2FtaW5nJTIwYXZhdGFyJTIwcHJvZmVzc2lvbmFsfGVufDF8fHx8MTc3MzQzMDQzOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    banner: "https://images.unsplash.com/photo-1765476450592-ad6ec11e312a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMGRhcmslMjBmYW50YXN5JTIwcHVycGxlfGVufDF8fHx8MTc3MzQzMDQ0M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  },
  // EMERALD - Verified
  {
    id: 104,
    initials: "EV",
    color: "from-[#50C878] to-[#00A86B]",
    username: "EmeraldVerified",
    time: "acum 24 min",
    content: "Emerald II verified top laner. Main Camille, Fiora, Jax. Looking for competitive team for tournaments!",
    tags: [
      { text: "Emerald II", bg: "bg-white/5", color: "text-white/70" },
      { text: "Top", bg: "bg-white/5", color: "text-white/70" },
      { text: "Clash", bg: "bg-white/5", color: "text-white/70" }
    ],
    riotVerified: true,
    language: "en",
    userLanguages: ["en"],
    rank: "Emerald II",
    lp: 72,
    avatar: "https://images.unsplash.com/photo-1628501899963-43bb8e2423e1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmZW1hbGUlMjBnYW1lciUyMHBvcnRyYWl0JTIwaGVhZHBob25lc3xlbnwxfHx8fDE3NzM0MzA0Mzh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    banner: "https://images.unsplash.com/photo-1769704552351-d5059b8bb6f9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMGdyYWRpZW50JTIwYmx1ZSUyMHB1cnBsZXxlbnwxfHx8fDE3NzM0MzA0NDB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  },

  // === POLSCY GRACZE (pl) - EUNE ===
  {
    id: 201,
    initials: "WW",
    color: "from-red-600 to-red-800",
    username: "WarsawWarrior",
    time: "3 min temu",
    content: "Gold III top laner szuka duo do rankeda. Gram Dariusem, Garenем, Malphite. Discord wymagany, spokojni gracze proszę!",
    tags: [
      { text: "Gold III", bg: "bg-white/5", color: "text-white/70" },
      { text: "Top", bg: "bg-white/5", color: "text-white/70" },
      { text: "Ranked Solo/Duo", bg: "bg-white/5", color: "text-white/70" }
    ],
    riotVerified: false,
    language: "pl",
    userLanguages: ["pl"],
    userNameColor: "from-purple-500 to-pink-500", // Purple-Pink gradient
    userProfileBackground: "CUSTOM:linear-gradient(to bottom right, #8000ff, #1a0033)" // Custom Purple gradient
  },
  {
    id: 202,
    initials: "KK",
    color: "from-white/20 to-gray-400",
    username: "KrakowKnight",
    time: "19 min temu",
    content: "Platinum II jungler zweryfikowany przez Riot. Gram Lee Sinem, Graves, Nidalee. Szukam poważnego teamù rankingowego lub Clash!",
    tags: [
      { text: "Platinum II", bg: "bg-white/5", color: "text-white/70" },
      { text: "Jungle", bg: "bg-white/5", color: "text-white/70" },
      { text: "Clash", bg: "bg-white/5", color: "text-white/70" }
    ],
    riotVerified: true,
    language: "pl",
    userLanguages: ["pl"],
    rank: "Platinum II",
    lp: 76
  },
  {
    id: 203,
    initials: "GG",
    color: "from-blue-500 to-blue-700",
    username: "GdanskGamer",
    time: "45 min temu",
    content: "Silver I mid, uczę się gry na Ahri i Lux. Szukam cierpliwego duo na wspólną wspinaczkę do Gold. Brak toksyczności!",
    tags: [
      { text: "Silver I", bg: "bg-white/5", color: "text-white/70" },
      { text: "Mid", bg: "bg-white/5", color: "text-white/70" },
      { text: "Ranked Solo/Duo", bg: "bg-white/5", color: "text-white/70" }
    ],
    riotVerified: false,
    language: "pl",
    userLanguages: ["pl"]
  },
  {
    id: 204,
    initials: "PQ",
    color: "from-emerald-500 to-green-600",
    username: "PoznanQueen",
    time: "2h temu",
    content: "Emerald III support, zweryfikowana. Gram Thresh, Lulu, Soraka. Szukam ADC dla duo ranked. Wymagany Discord i spokojna głowa!",
    tags: [
      { text: "Emerald III", bg: "bg-white/5", color: "text-white/70" },
      { text: "Support", bg: "bg-white/5", color: "text-white/70" },
      { text: "Ranked Solo/Duo", bg: "bg-white/5", color: "text-white/70" }
    ],
    riotVerified: true,
    language: "pl",
    userLanguages: ["pl"],
    rank: "Emerald III",
    lp: 41
  },

  // === ČEŠTÍ HRÁČI (cs) - EUNE ===
  {
    id: 301,
    initials: "PP",
    color: "from-blue-600 to-blue-800",
    username: "PraguePlayer",
    time: "před 7 min",
    content: "Gold II ADC hledám support duo pro rankované hry. Hlavní champs: Caitlyn, Jhin, Ezreal. Slušné chování nutné, žádný flame!",
    tags: [
      { text: "Gold II", bg: "bg-white/5", color: "text-white/70" },
      { text: "ADC", bg: "bg-white/5", color: "text-white/70" },
      { text: "Ranked Solo/Duo", bg: "bg-white/5", color: "text-white/70" }
    ],
    riotVerified: false,
    language: "cs",
    userLanguages: ["cs"],
    userNameColor: "from-[#50C878] to-[#00A86B]", // Emerald gradient
    userProfileBackground: "CUSTOM:linear-gradient(to bottom right, #00ff80, #001a0d)" // Custom Green gradient
  },
  {
    id: 302,
    initials: "BJ",
    color: "from-red-500 to-red-700",
    username: "BrnoJungler",
    time: "před 50 min",
    content: "Platinum I jungler ověřen přes Riot. Hlavní champs Vi, Hecarim, Sejuani. Hledám Clash tým na víkend. Discord povinný!",
    tags: [
      { text: "Platinum I", bg: "bg-white/5", color: "text-white/70" },
      { text: "Jungle", bg: "bg-white/5", color: "text-white/70" },
      { text: "Clash", bg: "bg-white/5", color: "text-white/70" }
    ],
    riotVerified: true,
    language: "cs",
    userLanguages: ["cs"],
    rank: "Platinum I",
    lp: 33
  },

  // === MAGYAR JÁTÉKOSOK (hu) - EUNE ===
  {
    id: 401,
    initials: "BM",
    color: "from-green-600 to-teal-600",
    username: "BudapestMid",
    time: "10 perce",
    content: "Platina I midlaner Riot-hitelesítéssel. Fő champek: Zed, Yasuo, Yone. Komoly Clash csapat keresek hétvégén. Discord kötelező!",
    tags: [
      { text: "Platinum I", bg: "bg-white/5", color: "text-white/70" },
      { text: "Mid", bg: "bg-white/5", color: "text-white/70" },
      { text: "Clash", bg: "bg-white/5", color: "text-white/70" }
    ],
    riotVerified: true,
    language: "hu",
    userLanguages: ["hu"],
    rank: "Platinum I",
    lp: 58
  },
  {
    id: 402,
    initials: "DS",
    color: "from-purple-500 to-purple-700",
    username: "DebrecenSupport",
    time: "1 órája",
    content: "Gold II support keresek ADC duo-t rankolt játékhoz. Main Thresh, Nautilus, Blitzcrank. Barátságos légkör, flame mentes környezet!",
    tags: [
      { text: "Gold II", bg: "bg-white/5", color: "text-white/70" },
      { text: "Support", bg: "bg-white/5", color: "text-white/70" },
      { text: "Ranked Solo/Duo", bg: "bg-white/5", color: "text-white/70" }
    ],
    riotVerified: false,
    language: "hu",
    userLanguages: ["hu"]
  },

  // === BULGARSKI IGRAČИ (bg) - EUNE ===
  {
    id: 501,
    initials: "SC",
    color: "from-white/20 to-emerald-600",
    username: "SofiaCarry",
    time: "преди 15 мин",
    content: "Злато I ADC търся support дуо за класирани игри. Основни чампиони: Jinx, Kai'Sa, Miss Fortune. Discord задължителен!",
    tags: [
      { text: "Gold I", bg: "bg-white/5", color: "text-white/70" },
      { text: "ADC", bg: "bg-white/5", color: "text-white/70" },
      { text: "Ranked Solo/Duo", bg: "bg-white/5", color: "text-white/70" }
    ],
    riotVerified: false,
    language: "bg",
    userLanguages: ["bg"]
  },
  {
    id: 502,
    initials: "PV",
    color: "from-red-700 to-red-900",
    username: "PlovdivViper",
    time: "преди 1ч",
    content: "Платина II джанглър, верифициран от Riot. Търся Clash отбор за уикенда. Мейн Vi, Jarvan, Amumu. Положително отношение задължително!",
    tags: [
      { text: "Platinum II", bg: "bg-white/5", color: "text-white/70" },
      { text: "Jungle", bg: "bg-white/5", color: "text-white/70" },
      { text: "Clash", bg: "bg-white/5", color: "text-white/70" }
    ],
    riotVerified: true,
    language: "bg",
    userLanguages: ["bg"],
    rank: "Platinum II",
    lp: 49
  }
];

// Define posts data for EUW
const initialPostsEUW = [
  {
    id: 1,
    initials: "SK",
    color: "from-blue-500 to-indigo-500",
    username: "ShadowKnight",
    time: "acum 5 min",
    content: "Looking for mid laner for ranked team. We're all Platinum+ and play every evening. Discord required!",
    tags: [
      { text: "Platinum II", bg: "bg-white/5", color: "text-white/70" },
      { text: "Ranked Flex", bg: "bg-white/5", color: "text-white/70" }
    ],
    riotVerified: false,
    language: "en",
    userLanguages: ["en"],
    avatar: "https://images.unsplash.com/photo-1759701546655-d90ec831aa52?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBwb3J0cmFpdCUyMGVzcG9ydHMlMjBwbGF5ZXJ8ZW58MXx8fHwxNzczNDMwNDM3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    banner: "https://images.unsplash.com/photo-1605727328079-f3115619d3a5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjeWJlcnB1bmslMjBuZW9uJTIwY2l0eSUyMGFic3RyYWN0fGVufDF8fHx8MTc3MzQzMDQzOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  },
  {
    id: 2,
    initials: "FL",
    color: "from-red-500 to-pink-500",
    username: "FlashLux",
    time: "acum 15 min",
    content: "Gold 3 ADC main seeking support duo. Let's climb together! Prefer chill and positive players.",
    tags: [
      { text: "Gold III", bg: "bg-white/5", color: "text-white/70" },
      { text: "Ranked Solo/Duo", bg: "bg-white/5", color: "text-white/70" }
    ],
    riotVerified: false,
    language: "en",
    userLanguages: ["en"],
    avatar: "https://images.unsplash.com/photo-1628501899963-43bb8e2423e1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmZW1hbGUlMjBnYW1lciUyMHBvcnRyYWl0JTIwaGVhZHBob25lc3xlbnwxfHx8fDE3NzM0MzA0Mzh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    banner: "https://images.unsplash.com/photo-1642537389593-cf3f195905d1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZW9uJTIwbGlnaHRzJTIwYWJzdHJhY3QlMjBiYWNrZ3JvdW5kfGVufDF8fHx8MTc3MzQzMDQ0M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  },
  {
    id: 3,
    initials: "JM",
    color: "from-teal-500 to-cyan-500",
    username: "JungleMaster",
    time: "acum 45 min",
    content: "Diamond 3 jungler looking for Clash team. Main Lee Sin, Graves, Nidalee. Serious players only!",
    tags: [
      { text: "Diamond III", bg: "bg-white/5", color: "text-white/70" },
      { text: "Jungle", bg: "bg-white/5", color: "text-white/70" },
      { text: "Clash", bg: "bg-white/5", color: "text-white/70" }
    ],
    riotVerified: true,
    language: "en",
    userLanguages: ["en"],
    avatar: "https://images.unsplash.com/photo-1571169186019-18acfb7036bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlc3BvcnRzJTIwZ2FtaW5nJTIwYXZhdGFyJTIwcHJvZmVzc2lvbmFsfGVufDF8fHx8MTc3MzQzMDQzOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    banner: "https://images.unsplash.com/photo-1628089700970-0012c5718efc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBrZXlib2FyZCUyMHJnYiUyMGxpZ2h0c3xlbnwxfHx8fDE3NzMzOTk5MjJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    rank: "Diamond III",
    lp: 51,
    userNameColor: "from-[#00d4ff] to-[#00b8e6]",
    userProfileBackground: "from-[#002233] via-[#004455] to-[#002233]",
    tournamentEarnings: 110,
    tournamentName: "EUW Diamond Invitational"
  },
  // === DEMO PROFILES EUW - All Ranks Verified & Not Verified ===
  // IRON - Verified
  {
    id: 201,
    initials: "IV",
    color: "from-[#6b5d56] to-[#4a3f3a]",
    username: "IronVerifiedEUW",
    time: "acum 1 oră",
    content: "Iron II verified EUW - still learning! Looking for patient teammates!",
    tags: [
      { text: "Iron II", bg: "bg-white/5", color: "text-white/70" },
      { text: "Support", bg: "bg-white/5", color: "text-white/70" },
      { text: "Ranked Solo/Duo", bg: "bg-white/5", color: "text-white/70" }
    ],
    riotVerified: true,
    language: "en",
    userLanguages: ["en"],
    rank: "Iron II",
    lp: 15,
    avatar: "https://images.unsplash.com/photo-1759701546655-d90ec831aa52?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBwb3J0cmFpdCUyMGVzcG9ydHMlMjBwbGF5ZXJ8ZW58MXx8fHwxNzczNDMwNDM3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    banner: "https://images.unsplash.com/photo-1628089700970-0012c5718efc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBrZXlib2FyZCUyMHJnYiUyMGxpZ2h0c3xlbnwxfHx8fDE3NzMzOTk5MjJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
  },
  // BRONZE - Verified
  {
    id: 202,
    initials: "BV",
    color: "from-[#cd7f32] to-[#8b4513]",
    username: "BronzeVerifiedEUW",
    time: "acum 1 oră 10 min",
    content: "Bronze I verified - climbing to Silver! Main top lane tanks!",
    tags: [
      { text: "Bronze I", bg: "bg-white/5", color: "text-white/70" },
      { text: "Top", bg: "bg-white/5", color: "text-white/70" },
      { text: "Ranked Solo/Duo", bg: "bg-white/5", color: "text-white/70" }
    ],
    riotVerified: true,
    language: "en",
    userLanguages: ["en"],
    rank: "Bronze I",
    lp: 82,
    avatar: "https://images.unsplash.com/photo-1571169186019-18acfb7036bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlc3BvcnRzJTIwZ2FtaW5nJTIwYXZhdGFyJTIwcHJvZmVzc2lvbmFsfGVufDF8fHx8MTc3MzQzMDQzOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    banner: "https://images.unsplash.com/photo-1765476450592-ad6ec11e312a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMGRhcmslMjBmYW50YXN5JTIwcHVycGxlfGVufDF8fHx8MTc3MzQzMDQ0M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    tournamentEarnings: 10,
    tournamentName: "EUW Bronze Cup"
  },
  // SILVER - Verified
  {
    id: 203,
    initials: "SV",
    color: "from-[#c0c0c0] to-[#808080]",
    username: "SilverVerifiedEUW",
    time: "acum 1 oră 20 min",
    content: "Silver II verified ADC main. Looking for support duo to climb to Gold!",
    tags: [
      { text: "Silver II", bg: "bg-white/5", color: "text-white/70" },
      { text: "ADC", bg: "bg-white/5", color: "text-white/70" },
      { text: "Ranked Solo/Duo", bg: "bg-white/5", color: "text-white/70" }
    ],
    riotVerified: true,
    language: "en",
    userLanguages: ["en"],
    rank: "Silver II",
    lp: 44,
    avatar: "https://images.unsplash.com/photo-1628501899963-43bb8e2423e1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmZW1hbGUlMjBnYW1lciUyMHBvcnRyYWl0JTIwaGVhZHBob25lc3xlbnwxfHx8fDE3NzM0MzA0Mzh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    banner: "https://images.unsplash.com/photo-1642537389593-cf3f195905d1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZW9uJTIwbGlnaHRzJTIwYWJzdHJhY3QlMjBiYWNrZ3JvdW5kfGVufDF8fHx8MTc3MzQzMDQ0M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    tournamentEarnings: 22,
    tournamentName: "EUW Silver League"
  },
  // GOLD - Verified
  {
    id: 204,
    initials: "GV",
    color: "from-[#ffd700] to-[#daa520]",
    username: "GoldVerifiedEUW",
    time: "acum 1 oră 30 min",
    content: "Gold I verified mid main. Pushing for Platinum before season ends!",
    tags: [
      { text: "Gold I", bg: "bg-white/5", color: "text-white/70" },
      { text: "Mid", bg: "bg-white/5", color: "text-white/70" },
      { text: "Ranked Solo/Duo", bg: "bg-white/5", color: "text-white/70" }
    ],
    riotVerified: true,
    language: "en",
    userLanguages: ["en"],
    rank: "Gold I",
    lp: 91,
    avatar: "https://images.unsplash.com/photo-1759701546655-d90ec831aa52?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBwb3J0cmFpdCUyMGVzcG9ydHMlMjBwbGF5ZXJ8ZW58MXx8fHwxNzczNDMwNDM3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    banner: "https://images.unsplash.com/photo-1766051666522-9cfa12675f5b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBzZXR1cCUyMG5lb24lMjBsaWdodHMlMjBwdXJwbGV8ZW58MXx8fHwxNzczNDMwNDM5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    tournamentEarnings: 35,
    tournamentName: "EUW Gold Series"
  },
  // PLATINUM - Verified
  {
    id: 205,
    initials: "PV",
    color: "from-[#00d4ff] to-[#00b8e6]",
    username: "PlatinumVerifiedEUW",
    time: "acum 2 ore",
    content: "Platinum II verified jungle main. Looking for serious ranked team!",
    tags: [
      { text: "Platinum II", bg: "bg-white/5", color: "text-white/70" },
      { text: "Jungle", bg: "bg-white/5", color: "text-white/70" },
      { text: "Ranked Solo/Duo", bg: "bg-white/5", color: "text-white/70" }
    ],
    riotVerified: true,
    language: "en",
    userLanguages: ["en"],
    rank: "Platinum II",
    lp: 38,
    avatar: "https://images.unsplash.com/photo-1571169186019-18acfb7036bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlc3BvcnRzJTIwZ2FtaW5nJTIwYXZhdGFyJTIwcHJvZmVzc2lvbmFsfGVufDF8fHx8MTc3MzQzMDQzOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    banner: "https://images.unsplash.com/photo-1765476450592-ad6ec11e312a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMGRhcmslMjBmYW50YXN5JTIwcHVycGxlfGVufDF8fHx8MTc3MzQzMDQ0M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    tournamentEarnings: 55,
    tournamentName: "EUW Platinum Open"
  },
  // EMERALD - Verified
  {
    id: 206,
    initials: "EV",
    color: "from-[#50C878] to-[#00A86B]",
    username: "EmeraldVerifiedEUW",
    time: "acum 2 ore 30 min",
    content: "Emerald III verified support. Looking for ADC duo or Clash team!",
    tags: [
      { text: "Emerald III", bg: "bg-white/5", color: "text-white/70" },
      { text: "Support", bg: "bg-white/5", color: "text-white/70" },
      { text: "Clash", bg: "bg-white/5", color: "text-white/70" }
    ],
    riotVerified: true,
    language: "en",
    userLanguages: ["en"],
    rank: "Emerald III",
    lp: 29,
    avatar: "https://images.unsplash.com/photo-1628501899963-43bb8e2423e1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmZW1hbGUlMjBnYW1lciUyMHBvcnRyYWl0JTIwaGVhZHBob25lc3xlbnwxfHx8fDE3NzM0MzA0Mzh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    banner: "https://images.unsplash.com/photo-1769704552351-d5059b8bb6f9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMGdyYWRpZW50JTIwYmx1ZSUyMHB1cnBsZXxlbnwxfHx8fDE3NzM0MzA0NDB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    tournamentEarnings: 85,
    tournamentName: "EUW Emerald Clash"
  },
  // MASTER - Verified
  {
    id: 207,
    initials: "MV",
    color: "from-[#e100ff] to-[#b300cc]",
    username: "MasterVerifiedEUW",
    time: "acum 3 ore",
    content: "Master verified top laner. Looking for Grandmaster push team!",
    tags: [
      { text: "Master", bg: "bg-white/5", color: "text-white/70" },
      { text: "Top", bg: "bg-white/5", color: "text-white/70" },
      { text: "Ranked Solo/Duo", bg: "bg-white/5", color: "text-white/70" }
    ],
    riotVerified: true,
    language: "en",
    userLanguages: ["en"],
    rank: "Master",
    lp: 142,
    avatar: "https://images.unsplash.com/photo-1759701546655-d90ec831aa52?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBwb3J0cmFpdCUyMGVzcG9ydHMlMjBwbGF5ZXJ8ZW58MXx8fHwxNzczNDMwNDM3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    banner: "https://images.unsplash.com/photo-1628089700970-0012c5718efc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYW1pbmclMjBrZXlib2FyZCUyMHJnYiUyMGxpZ2h0c3xlbnwxfHx8fDE3NzMzOTk5MjJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    tournamentEarnings: 200,
    tournamentName: "EUW Master Tournament"
  },
  // GRANDMASTER - Verified
  {
    id: 208,
    initials: "GV",
    color: "from-[#ff4444] to-[#cc0000]",
    username: "GrandmasterVerifiedEUW",
    time: "acum 3 ore 30 min",
    content: "Grandmaster verified mid. Top 150 EUW. Challenger push!",
    tags: [
      { text: "Grandmaster", bg: "bg-white/5", color: "text-white/70" },
      { text: "Mid", bg: "bg-white/5", color: "text-white/70" },
      { text: "Ranked Solo/Duo", bg: "bg-white/5", color: "text-white/70" }
    ],
    riotVerified: true,
    language: "en",
    userLanguages: ["en"],
    rank: "Grandmaster",
    lp: 321,
    avatar: "https://images.unsplash.com/photo-1571169186019-18acfb7036bb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlc3BvcnRzJTIwZ2FtaW5nJTIwYXZhdGFyJTIwcHJvZmVzc2lvbmFsfGVufDF8fHx8MTc3MzQzMDQzOHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    banner: "https://images.unsplash.com/photo-1765476450592-ad6ec11e312a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMGRhcmslMjBmYW50YXN5JTIwcHVycGxlfGVufDF8fHx8MTc3MzQzMDQ0M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    tournamentEarnings: 380,
    tournamentName: "EUW Grandmaster Series"
  },
  // CHALLENGER - Verified
  {
    id: 209,
    initials: "CV",
    color: "from-[#f4c430] to-[#ffaa00]",
    username: "ChallengerVerifiedEUW",
    time: "acum 4 ore",
    content: "Challenger Top 20 EUW verified. ADC main. Looking for pro team opportunities!",
    tags: [
      { text: "Challenger", bg: "bg-white/5", color: "text-white/70" },
      { text: "ADC", bg: "bg-white/5", color: "text-white/70" },
      { text: "Clash", bg: "bg-white/5", color: "text-white/70" }
    ],
    riotVerified: true,
    language: "en",
    userLanguages: ["en"],
    rank: "Challenger",
    lp: 1247,
    avatar: "https://images.unsplash.com/photo-1628501899963-43bb8e2423e1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmZW1hbGUlMjBnYW1lciUyMHBvcnRyYWl0JTIwaGVhZHBob25lc3xlbnwxfHx8fDE3NzM0MzA0Mzh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    banner: "https://images.unsplash.com/photo-1605727328079-f3115619d3a5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjeWJlcnB1bmslMjBuZW9uJTIwY2l0eSUyMGFic3RyYWN0fGVufDF8fHx8MTc3MzQzMDQzOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    tournamentEarnings: 750,
    tournamentName: "FinderQ Championship"
  },

  // === DEUTSCHE SPIELER (de) - EUW ===
  {
    id: 301,
    initials: "KJ",
    color: "from-gray-600 to-gray-800",
    username: "KaiserJungler",
    time: "vor 8 Min",
    content: "Gold II Jungler sucht Duo für die Rangliste. Hauptchamps: Vi, Jarvan, Hecarim. Discord Pflicht, kein Flame bitte!",
    tags: [
      { text: "Gold II", bg: "bg-white/5", color: "text-white/70" },
      { text: "Jungle", bg: "bg-white/5", color: "text-white/70" },
      { text: "Ranked Solo/Duo", bg: "bg-white/5", color: "text-white/70" }
    ],
    riotVerified: true,
    language: "de",
    userLanguages: ["de"],
    rank: "Gold II",
    lp: 63
  },
  {
    id: 302,
    initials: "RM",
    color: "from-blue-700 to-indigo-700",
    username: "RheinlandMid",
    time: "vor 22 Min",
    content: "Platinum I Midlaner sucht ernsthaftes Clash-Team für Wochenend-Turniere. Main Orianna, Azir, Viktor. Spreche fließend Deutsch und Englisch.",
    tags: [
      { text: "Platinum I", bg: "bg-white/5", color: "text-white/70" },
      { text: "Mid", bg: "bg-white/5", color: "text-white/70" },
      { text: "Clash", bg: "bg-white/5", color: "text-white/70" }
    ],
    riotVerified: true,
    language: "de",
    userLanguages: ["de"],
    rank: "Platinum I",
    lp: 44
  },
  {
    id: 303,
    initials: "BA",
    color: "from-red-600 to-orange-600",
    username: "BerlinADC",
    time: "vor 1 Std",
    content: "Diamond IV ADC sucht stabilen Support-Duo. Hauptchamps: Jinx, Kai'Sa, Caitlyn. Täglich online ab 19 Uhr. Riot-verifiziert!",
    tags: [
      { text: "Diamond IV", bg: "bg-white/5", color: "text-white/70" },
      { text: "ADC", bg: "bg-white/5", color: "text-white/70" },
      { text: "Ranked Solo/Duo", bg: "bg-white/5", color: "text-white/70" }
    ],
    riotVerified: true,
    language: "de",
    userLanguages: ["de"],
    rank: "Diamond IV",
    lp: 18
  },
  {
    id: 304,
    initials: "MS",
    color: "from-yellow-600 to-amber-600",
    username: "MunichSupport",
    time: "vor 2 Std",
    content: "Silber I Support-Hauptspieler, lerne noch viel. Suche geduldigen ADC zum gemeinsamen Aufstieg nach Gold. Thresh & Nautilus Main.",
    tags: [
      { text: "Silver I", bg: "bg-white/5", color: "text-white/70" },
      { text: "Support", bg: "bg-white/5", color: "text-white/70" },
      { text: "Ranked Solo/Duo", bg: "bg-white/5", color: "text-white/70" }
    ],
    riotVerified: false,
    language: "de",
    userLanguages: ["de"]
  },

  // === JOUEURS FRANÇAIS (fr) - EUW ===
  {
    id: 401,
    initials: "PJ",
    color: "from-blue-500 to-blue-700",
    username: "ParisJungler",
    time: "il y a 12 min",
    content: "Joueur Émeraude II cherche duo pour la ranked. Main jungle : Lee Sin, Graves, Nidalee. Bonne ambiance obligatoire, flamers s'abstenir !",
    tags: [
      { text: "Emerald II", bg: "bg-white/5", color: "text-white/70" },
      { text: "Jungle", bg: "bg-white/5", color: "text-white/70" },
      { text: "Ranked Solo/Duo", bg: "bg-white/5", color: "text-white/70" }
    ],
    riotVerified: true,
    language: "fr",
    userLanguages: ["fr"],
    rank: "Emerald II",
    lp: 71
  },
  {
    id: 402,
    initials: "LM",
    color: "from-red-500 to-rose-600",
    username: "LyonMidlaner",
    time: "il y a 35 min",
    content: "Gold I mid laner recherche équipe Clash sérieuse. Maîtrise Zed, Yasuo, Yone. Disponible le soir et le week-end. Discord actif.",
    tags: [
      { text: "Gold I", bg: "bg-white/5", color: "text-white/70" },
      { text: "Mid", bg: "bg-white/5", color: "text-white/70" },
      { text: "Clash", bg: "bg-white/5", color: "text-white/70" }
    ],
    riotVerified: false,
    language: "fr",
    userLanguages: ["fr"]
  },
  {
    id: 403,
    initials: "BS",
    color: "from-purple-500 to-violet-600",
    username: "BordeauxSupport",
    time: "il y a 1h",
    content: "Support Platine III vérifié Riot. Main Thresh, Lulu, Soraka. Cherche ADC sérieux pour grimper jusqu'au Diamant cette saison !",
    tags: [
      { text: "Platinum III", bg: "bg-white/5", color: "text-white/70" },
      { text: "Support", bg: "bg-white/5", color: "text-white/70" },
      { text: "Ranked Solo/Duo", bg: "bg-white/5", color: "text-white/70" }
    ],
    riotVerified: true,
    language: "fr",
    userLanguages: ["fr"],
    rank: "Platinum III",
    lp: 52
  },

  // === JUGADORES ESPAÑOLES (es) - EUW ===
  {
    id: 501,
    initials: "MM",
    color: "from-red-600 to-yellow-500",
    username: "MadridMidlaner",
    time: "hace 6 min",
    content: "Platino II mid, busco equipo Clash competitivo. Mains: Ahri, Lux, Syndra. Buena actitud es imprescindible. ¡Vamos a subir!",
    tags: [
      { text: "Platinum II", bg: "bg-white/5", color: "text-white/70" },
      { text: "Mid", bg: "bg-white/5", color: "text-white/70" },
      { text: "Clash", bg: "bg-white/5", color: "text-white/70" }
    ],
    riotVerified: true,
    language: "es",
    userLanguages: ["es"],
    rank: "Platinum II",
    lp: 88
  },
  {
    id: 502,
    initials: "BA",
    color: "from-orange-500 to-red-500",
    username: "BarcelonaADC",
    time: "hace 28 min",
    content: "ADC Oro I buscando support duo para subir a Platino. Main Caitlyn, Ezreal, Jinx. Disponible tardes de 20h a 00h. ¡Sin flame!",
    tags: [
      { text: "Gold I", bg: "bg-white/5", color: "text-white/70" },
      { text: "ADC", bg: "bg-white/5", color: "text-white/70" },
      { text: "Ranked Solo/Duo", bg: "bg-white/5", color: "text-white/70" }
    ],
    riotVerified: false,
    language: "es",
    userLanguages: ["es"]
  },
  {
    id: 503,
    initials: "SJ",
    color: "from-yellow-500 to-amber-500",
    username: "SevillaJungler",
    time: "hace 2h",
    content: "Jungla Diamante IV verificado, buscando equipo ranked flex. Mains Vi, Sejuani, Amumu. Discord obligatorio. ¡Serio y positivo!",
    tags: [
      { text: "Diamond IV", bg: "bg-white/5", color: "text-white/70" },
      { text: "Jungle", bg: "bg-white/5", color: "text-white/70" },
      { text: "Ranked Flex", bg: "bg-white/5", color: "text-white/70" }
    ],
    riotVerified: true,
    language: "es",
    userLanguages: ["es"],
    rank: "Diamond IV",
    lp: 37
  },

  // === GIOCATORI ITALIANI (it) - EUW ===
  {
    id: 601,
    initials: "RT",
    color: "from-green-600 to-emerald-700",
    username: "RomaTop",
    time: "5 min fa",
    content: "Top laner Argento II, cerco team amichevole per ranked. Main Darius, Garen, Malphite. Niente flame, solo gioco positivo!",
    tags: [
      { text: "Silver II", bg: "bg-white/5", color: "text-white/70" },
      { text: "Top", bg: "bg-white/5", color: "text-white/70" },
      { text: "Ranked Solo/Duo", bg: "bg-white/5", color: "text-white/70" }
    ],
    riotVerified: false,
    language: "it",
    userLanguages: ["it"]
  },
  {
    id: 602,
    initials: "MM",
    color: "from-red-500 to-red-700",
    username: "MilanoMid",
    time: "45 min fa",
    content: "Mid Platino I verificato Riot. Cerco duo serio per spingere verso Diamante. Main Zed, Akali, Katarina. Disponibile dalle 19h.",
    tags: [
      { text: "Platinum I", bg: "bg-white/5", color: "text-white/70" },
      { text: "Mid", bg: "bg-white/5", color: "text-white/70" },
      { text: "Ranked Solo/Duo", bg: "bg-white/5", color: "text-white/70" }
    ],
    riotVerified: true,
    language: "it",
    userLanguages: ["it"],
    rank: "Platinum I",
    lp: 67
  },

  // === DUTCH PLAYERS (nl) - EUW ===
  {
    id: 701,
    initials: "AS",
    color: "from-orange-500 to-orange-700",
    username: "AmsterdamSupport",
    time: "10 min geleden",
    content: "Goud III support op zoek naar ADC duo. Main Thresh, Blitzcrank, Leona. Positief en rustig, geen geflame graag!",
    tags: [
      { text: "Gold III", bg: "bg-white/5", color: "text-white/70" },
      { text: "Support", bg: "bg-white/5", color: "text-white/70" },
      { text: "Ranked Solo/Duo", bg: "bg-white/5", color: "text-white/70" }
    ],
    riotVerified: false,
    language: "nl",
    userLanguages: ["nl"]
  },
  {
    id: 702,
    initials: "RJ",
    color: "from-blue-600 to-cyan-600",
    username: "RotterdamJungle",
    time: "1 uur geleden",
    content: "Platina II jungler zoekt serieus Clash-team. Riot geverifieerd. Main Graves, Lee Sin, Viego. Discord vereist, Nederlands of Engels!",
    tags: [
      { text: "Platinum II", bg: "bg-white/5", color: "text-white/70" },
      { text: "Jungle", bg: "bg-white/5", color: "text-white/70" },
      { text: "Clash", bg: "bg-white/5", color: "text-white/70" }
    ],
    riotVerified: true,
    language: "nl",
    userLanguages: ["nl"],
    rank: "Platinum II",
    lp: 55
  }
];

// Define posts data for NA
const initialPostsNA = [
  {
    id: 5001,
    initials: "TS",
    color: "from-[#c0c0c0] to-[#808080]",
    username: "TopShotNA",
    time: "2 min ago",
    content: "Silver 1 ADC main looking for support duo. Let's climb to Gold together! I have good positioning and CS skills.",
    tags: [
      { text: "Silver I", bg: "bg-white/5", color: "text-white/70" },
      { text: "ADC", bg: "bg-white/5", color: "text-white/70" },
      { text: "Ranked Solo/Duo", bg: "bg-white/5", color: "text-white/70" }
    ],
    riotVerified: true,
    language: "en",
    userLanguages: ["en"],
    rank: "Silver I",
    lp: 78
  },
  {
    id: 5002,
    initials: "DK",
    color: "from-[#ffd700] to-[#daa520]",
    username: "DragonKingNA",
    time: "5 min ago",
    content: "Gold 2 Jungle main, playing Graves and Kindred. Looking for serious team for Clash this weekend!",
    tags: [
      { text: "Gold II", bg: "bg-white/5", color: "text-white/70" },
      { text: "Jungle", bg: "bg-white/5", color: "text-white/70" },
      { text: "Clash", bg: "bg-white/5", color: "text-white/70" }
    ],
    riotVerified: true,
    language: "en",
    userLanguages: ["en"],
    rank: "Gold II",
    lp: 42
  },
  {
    id: 5003,
    initials: "PM",
    color: "from-[#00d4ff] to-[#00b8e6]",
    username: "PlatMidNA",
    time: "10 min ago",
    content: "Platinum 3 Mid laner, one-trick Zed. Need ADC and Support for ranked flex. Chill vibes only!",
    tags: [
      { text: "Platinum III", bg: "bg-white/5", color: "text-white/70" },
      { text: "Mid", bg: "bg-white/5", color: "text-white/70" },
      { text: "Ranked Flex", bg: "bg-white/5", color: "text-white/70" }
    ],
    riotVerified: true,
    language: "en",
    userLanguages: ["en"],
    rank: "Platinum III",
    lp: 65
  }
];

// Define posts data for KR
const initialPostsKR = [
  {
    id: 6001,
    initials: "KP",
    color: "from-[#b9f2ff] to-[#00d4ff]",
    username: "KR_ProPlayer",
    time: "1 min ago",
    content: "Diamond 1 Top main, playing Aatrox, Riven, Fiora. Looking for high elo team. Speak English and Korean.",
    tags: [
      { text: "Diamond I", bg: "bg-white/5", color: "text-white/70" },
      { text: "Top", bg: "bg-white/5", color: "text-white/70" },
      { text: "Ranked Solo/Duo", bg: "bg-white/5", color: "text-white/70" }
    ],
    riotVerified: true,
    language: "en",
    userLanguages: ["en"],
    rank: "Diamond I",
    lp: 88
  },
  {
    id: 6002,
    initials: "SM",
    color: "from-[#e100ff] to-[#b300cc]",
    username: "SeoulMaster",
    time: "3 min ago",
    content: "Master tier Support, Thresh/Bard main. Need ADC duo for serious climbing. Voice required.",
    tags: [
      { text: "Master", bg: "bg-white/5", color: "text-white/70" },
      { text: "Support", bg: "bg-white/5", color: "text-white/70" },
      { text: "Ranked Solo/Duo", bg: "bg-white/5", color: "text-white/70" }
    ],
    riotVerified: true,
    language: "en",
    userLanguages: ["en"],
    rank: "Master",
    lp: 234
  }
];

// Define posts data for BR
const initialPostsBR = [
  {
    id: 7001,
    initials: "BJ",
    color: "from-[#ffd700] to-[#daa520]",
    username: "BrasilJungle",
    time: "há 3 min",
    content: "Ouro 1 selva, jogo de Lee Sin e Vi. Procuro time para subir platina. Bora galera!",
    tags: [
      { text: "Gold I", bg: "bg-white/5", color: "text-white/70" },
      { text: "Jungle", bg: "bg-white/5", color: "text-white/70" },
      { text: "Ranked Solo/Duo", bg: "bg-white/5", color: "text-white/70" }
    ],
    riotVerified: true,
    language: "pt",
    userLanguages: ["pt"],
    rank: "Gold I",
    lp: 72
  },
  {
    id: 7002,
    initials: "SP",
    color: "from-[#00d4ff] to-[#00b8e6]",
    username: "SaoPauloPlayer",
    time: "há 5 min",
    content: "Platina 2 suporte, jogo muito de Lulu e Nami. Preciso de ADC para duo ranked. Discord obrigatório!",
    tags: [
      { text: "Platinum II", bg: "bg-white/5", color: "text-white/70" },
      { text: "Support", bg: "bg-white/5", color: "text-white/70" },
      { text: "Ranked Solo/Duo", bg: "bg-white/5", color: "text-white/70" }
    ],
    riotVerified: true,
    language: "pt",
    userLanguages: ["pt"],
    rank: "Platinum II",
    lp: 51
  },
  {
    id: 7003,
    initials: "RT",
    color: "from-[#50C878] to-[#00A86B]",
    username: "RioTop",
    time: "há 8 min",
    content: "Esmeralda 4 topo, main Sett e Garen. Buscando time para Clash esse fim de semana. Vem!",
    tags: [
      { text: "Emerald IV", bg: "bg-white/5", color: "text-white/70" },
      { text: "Top", bg: "bg-white/5", color: "text-white/70" },
      { text: "Clash", bg: "bg-white/5", color: "text-white/70" }
    ],
    riotVerified: true,
    language: "pt",
    userLanguages: ["pt"],
    rank: "Emerald IV",
    lp: 33
  }
];

// Define posts data for LAN + LAS
const initialPostsLANLAS = [
  {
    id: 8001,
    initials: "LM",
    color: "from-[#ffd700] to-[#daa520]",
    username: "LatinoMid",
    time: "hace 2 min",
    content: "Oro 3 mid main, juego Yasuo y Yone. Busco equipo serio para subir a Platino. ¡Vamos!",
    tags: [
      { text: "Gold III", bg: "bg-white/5", color: "text-white/70" },
      { text: "Mid", bg: "bg-white/5", color: "text-white/70" },
      { text: "Ranked Solo/Duo", bg: "bg-white/5", color: "text-white/70" }
    ],
    riotVerified: true,
    language: "es",
    userLanguages: ["es"],
    rank: "Gold III",
    lp: 48
  },
  {
    id: 8002,
    initials: "AS",
    color: "from-[#c0c0c0] to-[#808080]",
    username: "ArgentinaSup",
    time: "hace 4 min",
    content: "Plata 2 support, main Thresh y Pyke. Necesito ADC para duoQ. Discord disponible!",
    tags: [
      { text: "Silver II", bg: "bg-white/5", color: "text-white/70" },
      { text: "Support", bg: "bg-white/5", color: "text-white/70" },
      { text: "Ranked Solo/Duo", bg: "bg-white/5", color: "text-white/70" }
    ],
    riotVerified: true,
    language: "es",
    userLanguages: ["es"],
    rank: "Silver II",
    lp: 61
  },
  {
    id: 8003,
    initials: "MJ",
    color: "from-[#00d4ff] to-[#00b8e6]",
    username: "MexicoJungle",
    time: "hace 7 min",
    content: "Platino 1 jungla, juego Kha'Zix y Elise. Buscando equipo para Clash. ¡Únete!",
    tags: [
      { text: "Platinum I", bg: "bg-white/5", color: "text-white/70" },
      { text: "Jungle", bg: "bg-white/5", color: "text-white/70" },
      { text: "Clash", bg: "bg-white/5", color: "text-white/70" }
    ],
    riotVerified: true,
    language: "es",
    userLanguages: ["es"],
    rank: "Platinum I",
    lp: 82
  }
];

// Define posts data for OCE
const initialPostsOCE = [
  {
    id: 9001,
    initials: "AU",
    color: "from-[#ffd700] to-[#daa520]",
    username: "AussieTop",
    time: "3 min ago",
    content: "Gold 2 Top main from Sydney. Play Darius, Garen, and Mordekaiser. Looking for chill team!",
    tags: [
      { text: "Gold II", bg: "bg-white/5", color: "text-white/70" },
      { text: "Top", bg: "bg-white/5", color: "text-white/70" },
      { text: "Ranked Solo/Duo", bg: "bg-white/5", color: "text-white/70" }
    ],
    riotVerified: true,
    language: "en",
    userLanguages: ["en"],
    rank: "Gold II",
    lp: 55
  },
  {
    id: 9002,
    initials: "NZ",
    color: "from-[#00d4ff] to-[#00b8e6]",
    username: "NZ_Platinum",
    time: "6 min ago",
    content: "Plat 3 ADC, Jinx and Caitlyn main. Need support duo for ranked. Keen to climb!",
    tags: [
      { text: "Platinum III", bg: "bg-white/5", color: "text-white/70" },
      { text: "ADC", bg: "bg-white/5", color: "text-white/70" },
      { text: "Ranked Solo/Duo", bg: "bg-white/5", color: "text-white/70" }
    ],
    riotVerified: true,
    language: "en",
    userLanguages: ["en"],
    rank: "Platinum III",
    lp: 47
  }
];

// Define posts data for TR
const initialPostsTR = [
  {
    id: 10001,
    initials: "İM",
    color: "from-[#ffd700] to-[#daa520]",
    username: "İstanbulMid",
    time: "2 dakika önce",
    content: "Altın 1 mid main, Ahri ve Syndra oynuyorum. Platin için takım arıyorum. Gelin beraber çıkalım!",
    tags: [
      { text: "Gold I", bg: "bg-white/5", color: "text-white/70" },
      { text: "Mid", bg: "bg-white/5", color: "text-white/70" },
      { text: "Ranked Solo/Duo", bg: "bg-white/5", color: "text-white/70" }
    ],
    riotVerified: true,
    language: "tr",
    userLanguages: ["tr"],
    rank: "Gold I",
    lp: 69
  },
  {
    id: 10002,
    initials: "AS",
    color: "from-[#00d4ff] to-[#00b8e6]",
    username: "AnkaraSup",
    time: "5 dakika önce",
    content: "Platin 2 destek, Nautilus ve Leona oynuyorum. ADC duo için bekliyorum. Discord var!",
    tags: [
      { text: "Platinum II", bg: "bg-white/5", color: "text-white/70" },
      { text: "Support", bg: "bg-white/5", color: "text-white/70" },
      { text: "Ranked Solo/Duo", bg: "bg-white/5", color: "text-white/70" }
    ],
    riotVerified: true,
    language: "tr",
    userLanguages: ["tr"],
    rank: "Platinum II",
    lp: 38
  },
  {
    id: 10003,
    initials: "İO",
    color: "from-[#50C878] to-[#00A86B]",
    username: "İzmirOrman",
    time: "8 dakika önce",
    content: "Zümrüt 3 orman main, Lee Sin ve Jarvan oynuyorum. Clash için takım lazım!",
    tags: [
      { text: "Emerald III", bg: "bg-white/5", color: "text-white/70" },
      { text: "Jungle", bg: "bg-white/5", color: "text-white/70" },
      { text: "Clash", bg: "bg-white/5", color: "text-white/70" }
    ],
    riotVerified: true,
    language: "tr",
    userLanguages: ["tr"],
    rank: "Emerald III",
    lp: 52
  }
];

// Define posts data for JP
const initialPostsJP = [
  {
    id: 11001,
    initials: "TK",
    color: "from-[#00d4ff] to-[#00b8e6]",
    username: "TokyoPlayer",
    time: "4 min ago",
    content: "Platinum 1 Support main. Play Lulu, Soraka, Janna. Looking for ADC duo. English OK!",
    tags: [
      { text: "Platinum I", bg: "bg-white/5", color: "text-white/70" },
      { text: "Support", bg: "bg-white/5", color: "text-white/70" },
      { text: "Ranked Solo/Duo", bg: "bg-white/5", color: "text-white/70" }
    ],
    riotVerified: true,
    language: "en",
    userLanguages: ["en"],
    rank: "Platinum I",
    lp: 71
  },
  {
    id: 11002,
    initials: "OK",
    color: "from-[#50C878] to-[#00A86B]",
    username: "OsakaKing",
    time: "7 min ago",
    content: "Emerald 2 Jungle, Vi and Hecarim main. Need team for Clash. Voice chat available!",
    tags: [
      { text: "Emerald II", bg: "bg-white/5", color: "text-white/70" },
      { text: "Jungle", bg: "bg-white/5", color: "text-white/70" },
      { text: "Clash", bg: "bg-white/5", color: "text-white/70" }
    ],
    riotVerified: true,
    language: "en",
    userLanguages: ["en"],
    rank: "Emerald II",
    lp: 44
  }
];

// Define posts data for ME / SEA
const initialPostsMESEA = [
  {
    id: 12001,
    initials: "DM",
    color: "from-[#ffd700] to-[#daa520]",
    username: "DubaiMid",
    time: "3 min ago",
    content: "Gold 1 Mid laner, playing Zed and Talon. Looking for serious team to push Platinum!",
    tags: [
      { text: "Gold I", bg: "bg-white/5", color: "text-white/70" },
      { text: "Mid", bg: "bg-white/5", color: "text-white/70" },
      { text: "Ranked Solo/Duo", bg: "bg-white/5", color: "text-white/70" }
    ],
    riotVerified: true,
    language: "en",
    userLanguages: ["en"],
    rank: "Gold I",
    lp: 66
  },
  {
    id: 12002,
    initials: "SG",
    color: "from-[#00d4ff] to-[#00b8e6]",
    username: "SingaporeADC",
    time: "5 min ago",
    content: "Plat 2 ADC main from Singapore. Play Kai'Sa, Vayne, Ezreal. Need support duo!",
    tags: [
      { text: "Platinum II", bg: "bg-white/5", color: "text-white/70" },
      { text: "ADC", bg: "bg-white/5", color: "text-white/70" },
      { text: "Ranked Solo/Duo", bg: "bg-white/5", color: "text-white/70" }
    ],
    riotVerified: true,
    language: "en",
    userLanguages: ["en"],
    rank: "Platinum II",
    lp: 58
  },
  {
    id: 12003,
    initials: "BT",
    color: "from-[#50C878] to-[#00A86B]",
    username: "BangkokTop",
    time: "8 min ago",
    content: "Emerald 4 Top main, playing Camille and Jax. Looking for Clash team this weekend!",
    tags: [
      { text: "Emerald IV", bg: "bg-white/5", color: "text-white/70" },
      { text: "Top", bg: "bg-white/5", color: "text-white/70" },
      { text: "Clash", bg: "bg-white/5", color: "text-white/70" }
    ],
    riotVerified: true,
    language: "en",
    userLanguages: ["en"],
    rank: "Emerald IV",
    lp: 29
  }
];


export const initialPostsEUNE_data = initialPostsEUNE;
export const initialPostsEUW_data = initialPostsEUW;
export const initialPostsNA_data = initialPostsNA;
export const initialPostsKR_data = initialPostsKR;
export const initialPostsBR_data = initialPostsBR;
export const initialPostsLANLAS_data = initialPostsLANLAS;
export const initialPostsOCE_data = initialPostsOCE;
export const initialPostsTR_data = initialPostsTR;
export const initialPostsJP_data = initialPostsJP;
export const initialPostsMESEA_data = initialPostsMESEA;

export const demoPosts = {
  EUNE: addJoinDatesToPosts(ensureUniqueIds(initialPostsEUNE)),
  EUW: addJoinDatesToPosts(ensureUniqueIds(initialPostsEUW)),
  NA: addJoinDatesToPosts(ensureUniqueIds(initialPostsNA)),
  KR: addJoinDatesToPosts(ensureUniqueIds(initialPostsKR)),
  BR: addJoinDatesToPosts(ensureUniqueIds(initialPostsBR)),
  LANLAS: addJoinDatesToPosts(ensureUniqueIds(initialPostsLANLAS)),
  OCE: addJoinDatesToPosts(ensureUniqueIds(initialPostsOCE)),
  TR: addJoinDatesToPosts(ensureUniqueIds(initialPostsTR)),
  JP: addJoinDatesToPosts(ensureUniqueIds(initialPostsJP)),
  MESEA: addJoinDatesToPosts(ensureUniqueIds(initialPostsMESEA)),
};
