import React from 'react';

export const projects = [
  // VIDEOS
  { id: 1, title: 'Eternity Solutions Product Demo', category: 'video', year: '2024', description: 'Corporate SAAS Product Demo explaining everything that Eternity Solution has to offer under new rebranding', youtubeId: 'g_SkCJnU0jE' },
  { id: 2, title: 'PreScience Founder Introduction', category: 'video', year: '2024', description: 'Corporate Founders Video Series on the trmeric platform', youtubeId: 'jpxjJgwPSTo' },
  { id: 3, title: 'Tech X Squared', category: 'video', year: '2024', description: 'An ad style company showcase giving life to a revoluntionary creative vision.', youtubeId: 'vlFqThlpCBs' },
  { id: 4, title: 'Eternity Solutions Introductions: Speed vs Effectiveness Teaser', category: 'video', year: '2025', description: 'A short teaser of a founders thought leadership video', youtubeId: 'yyQ1sZDIiVk' },
  { id: 5, title: 'IndusGuru Founders Introduction', category: 'video', year: '2024', description: 'Corporate Founders Video Series on the trmeric platform', youtubeId: 'FUIAYnWfCH8' },
  // { id: 6, title: 'Kelp Forest Journey', category: 'video', year: '2023', description: 'Underwater forest ecosystem', youtubeId: '9mf7EJ7t2f4' },
  { id: 7, title: 'P-Sonar Plus Ad', category: 'video', year: '2024', description: 'An ad for a new headphone product', youtubeId: 'yITOKo-HQOY' },
  { id: 8, title: 'CGM Creative Services Intro', category: 'video', year: '2024', description: 'A video introduction to my services under CGM.', youtubeId: '8jD2PkiFNfY' },

  // PHOTOGRAPHY
    { id: 9, category: 'photography', year: '2024', image: '/photos/phototwelve.jpg' },
    { id: 46, category: 'photography', year: '2024', image: '/photos/photofour.jpg' },
    { id: 12, category: 'photography', year: '2023', image: '/photos/photothree.jpg'  },
    { id: 30, category: 'photography', year: '2023', image: '/photos/photothirteen.jpg' },
    { id: 45, category: 'photography', year: '2023', image: '/photos/photofive.jpg' },
    { id: 35, category: 'photography', year: '2023', image: '/photos/photosix.jpg' },
    { id: 36, category: 'photography', year: '2023', image: '/photos/photoseven.jpg' },
    { id: 37, category: 'photography', year: '2023', image: '/photos/photoeight.jpg' },
    { id: 38, category: 'photography', year: '2023', image: '/photos/photonine.jpg' },
    { id: 39, category: 'photography', year: '2023', image: '/photos/phototen.jpg' },
    { id: 40, category: 'photography', year: '2023', image: '/photos/photoeleven.jpg' },
    { id: 41, category: 'photography', year: '2023', image: '/photos/photoone.jpg' },
    { id: 42, category: 'photography', year: '2023', image: '/photos/phototwo.jpg' },
  // MUSIC
  { id: 10, title: 'Twenty-Five', category: 'music', year: '2021', description: 'Vocalist / Songwriter / Graphic Designer', youtubeId: '5GIae2G2wzo' },
  { id: 11, title: 'Echo', category: 'music', year: '2021', description: 'Vocalist / Songwriter / Graphic Designer', youtubeId: 'R8XX7tS5gR4' },
  { id: 14, title: 'Let Me Loose', category: 'music', year: '2023', description: 'Vocalist / Songwriter / Graphic Designer', youtubeId: 'yZyaT02-iLc' },
  { id: 17, title: 'Tension', category: 'music', year: '2022', description: 'Vocalist / Songwriter / Graphic Designer', youtubeId: '3EMVGEtc-_0' },
  { id: 18, title: 'Explode', category: 'music', year: '2021', description: 'Vocalist / Songwriter / Graphic Designer', youtubeId: '1MlYQ38n2V4' },
  { id: 19, title: 'Footloose', category: 'music', year: '2021', description: 'Vocalist / Songwriter / Graphic Designer', youtubeId: '1a-15ZPoV6c' },
  { id: 20, title: 'Big Sauce', category: 'music', year: '2020', description: 'Vocalist / Songwriter / Producer / Graphic Designer', youtubeId: 'g61WPCA7Jnw' },
  { id: 21, title: 'Cyan', category: 'music', year: '2020', description: 'Vocalist / Songwriter / Producer / Graphic Designer', youtubeId: 'RClw2M_9dJg' },
  { id: 22, title: 'Suga Lips', category: 'music', year: '2020', description: 'Vocalist / Songwriter / Producer / Graphic Designer', youtubeId: 'mgjpfsAt27M' },
  { id: 23, title: 'Typhoon', category: 'music', year: '2020', description: 'Vocalist / Songwriter / Producer / Graphic Designer', youtubeId: '6odNrES7--s' },
  { id: 24, title: 'Take A Flick', category: 'music', year: '2020', description: 'Vocalist / Songwriter / Producer / Graphic Designer', youtubeId: '1zKpmB4IB1M' },
  { id: 25, title: 'Strawberry Cough', category: 'music', year: '2022', description: 'Vocalist / Songwriter / Producer / Graphic Designer', youtubeId: 'aL9DA0U7U5c' },
// Add this to your ARTICLES section in projectsData.jsx

{ 
  id: 47, 
  title: 'Overcoming Oversaturation', 
  category: 'articles', 
  year: '2024', 
  description: 'On forming your own opinions in the age of metrics',
  image: '/articles/Oversaturation.jpg',
  content: (
    <div className="font-body">
      <div className="mb-8 p-6 font-heading bg-emerald-900/20 border-l-4 border-emerald-400 rounded-r-lg">
        <p className="text-emerald-200/90 italic text-lg leading-relaxed">
          In today's digital age, expressing one's opinion to a wide audience has become easier than ever. 
          However, this ease of communication has led to a challenging landscape where understanding the true 
          value of an opinion often relies on metrics such as engagement, likes, subscriptions, and follows.
        </p>
      </div>

      <h3 className="text-2xl font-bold text-emerald-300 mt-8 mb-4 flex gap-3">
        <span className="text-3xl ">📊</span>
        The Trap of Popularity Metrics
      </h3>
      <p className="mb-4">
        Even those aware of this phenomenon can fall into the trap of judging content based on its popularity 
        rather than its intrinsic worth. Have you ever found yourself scrolling through platforms like YouTube, 
        Facebook, Instagram, LinkedIn, or even job sites like Indeed, and basing your decision to engage with 
        content solely on its "stats"?
      </p>
      <p className="mb-6">
        This behavior extends beyond social media to various aspects of our lives, including ride-sharing 
        services, food delivery, movies, and product reviews on e-commerce sites. The prevalence of ratings 
        and statistics can overshadow great creators and valuable content across all industries.
      </p>

      <div className="my-8 p-5 bg-gradient-to-r from-emerald-900/30 to-teal-900/30 rounded-lg border border-emerald-500/30">
        <p className="text-emerald-100 font-semibold text-lg">
          But does high viewership or a multitude of positive ratings truly indicate superior quality? 
          Should we abandon our passions if they don't align with current trends or immediately capture 
          widespread attention?
        </p>
      </div>

      <h3 className="text-2xl font-bold text-emerald-300 mt-8 mb-4 flex items-center gap-3">
        <span className="text-3xl">💭</span>
        Finding Your Own Voice
      </h3>
      <p className="mb-4">
        It's crucial to question whether these numbers and percentages should outweigh our personal opinions. 
        What do you genuinely believe? What truly inspires you?
      </p>
      <p className="mb-6">
        If you're someone who isn't afraid to be the sole supporter of a great experience or piece of content, 
        I applaud your independence. Your willingness to form and express your own opinion, regardless of 
        popular sentiment, is admirable.
      </p>
      <p className="mb-6">
        For those who habitually seek out stats or ratings before engaging with content, I encourage you to 
        be more conscious of this tendency and give more things a chance based on your own judgment.
      </p>

      <h3 className="text-2xl font-bold text-emerald-300 mt-8 mb-4 flex items-center gap-3">
        <span className="text-3xl">⚖️</span>
        When Ratings Matter
      </h3>
      <p className="mb-4">
        Of course, there are instances where ratings and reviews can be beneficial, particularly when it comes 
        to experiences with potentially negative consequences.
      </p>
      <div className="mb-6 p-4 bg-teal-900/20 rounded-lg border-l-2 border-teal-400">
        <p className="text-emerald-200/90">
          <strong className="text-teal-300">For example:</strong> Reviews can help you avoid a chef known for 
          unpalatable dishes or a careless barber who might damage your hair. These situations have more 
          significant implications than simply watching a video or movie and providing feedback.
        </p>
      </div>

      <h3 className="text-2xl font-bold text-emerald-300 mt-8 mb-4 flex items-center gap-3">
        <span className="text-3xl">🌊</span>
        Swimming Against the Current
      </h3>
      <p className="mb-4">
        As our culture increasingly gravitates towards conformity, it becomes ever more important to cultivate 
        our ability to think independently, drawing on our unique perspectives and experiences.
      </p>
      <p className="mb-4">
        If you enjoyed an experience that others haven't recognized yet, don't be afraid to voice your support. 
        While others may challenge your opinion or question your individuality, remember that true freedom lies 
        in the ability to stand for or against something, regardless of others' disapproval.
      </p>

      <div className="mt-8 p-6 bg-gradient-to-br from-emerald-800/40 to-teal-900/40 rounded-xl border border-emerald-400/50">
        <h4 className="text-xl font-bold text-emerald-200 mb-3">In Conclusion</h4>
        <p className="text-emerald-100/90 leading-relaxed">
          While the digital age offers unprecedented access to information and opinions, it's crucial to 
          maintain our individual voices. By consciously forming our own judgments and having the courage 
          to express them, we can contribute to a richer, more diverse cultural landscape.
        </p>
      </div>

      <div className="mt-8 pt-6 border-t border-emerald-500/30">
        <p className="text-emerald-300/70 italic text-center">
          "The greatest gift you can give is the courage to form your own opinion."
        </p>
      </div>
    </div>
  )
},
  // Add this to your ARTICLES section in projectsData.jsx

{ 
  id: 48, 
  title: 'The Overlooked Art Of Corporate Video Storytelling', 
  category: 'articles', 
  year: '2024', 
  description: 'Why corporate videos need more than just good ideas',
  image: '/articles/CorporateVideo.jpg',
  content: (
    <div className="font-body">
      <div className="mb-8 p-6 bg-gradient-to-r from-emerald-900/30 to-teal-900/30 rounded-lg border border-emerald-500/30">
        <p className="text-emerald-200/90 italic text-lg leading-relaxed">
          In the realm of corporate video advertisements and engagements, many companies overlook a crucial 
          element: the art of storytelling.
        </p>
      </div>

      <h3 className="text-2xl font-bold text-emerald-300 mt-8 mb-4 flex items-center gap-3">
        <span className="text-3xl">🎬</span>
        Beyond the Basics
      </h3>
      <p className="mb-4">
        You might ask yourself, "Why should I care about this? Can't I just learn it on my own?" The truth is, 
        while the concept seems straightforward, its application is far more nuanced and challenging.
      </p>
      <p className="mb-6">
        Creating a video is one thing, but crafting a narrative with rhythm, flow, and cadence is an entirely 
        different skill set. It's a craft that requires expertise, much like composing a piece of music or 
        choreographing a dance.
      </p>

      <div className="my-8 p-5 bg-emerald-900/20 border-l-4 border-emerald-400 rounded-r-lg">
        <p className="text-emerald-100 font-semibold text-lg">
          There exists a group of professionals who understand the intricacies of building and finessing a 
          proper flow in trending videos, an art form that many corporate entities fail to fully appreciate.
        </p>
      </div>

      <h3 className="text-2xl font-bold text-emerald-300 mt-8 mb-4 flex items-center gap-3">
        <span className="text-3xl">⚠️</span>
        The Common Trap
      </h3>
      <p className="mb-4">
        Video creative novices from other industries often fall into a common trap. They produce a video 
        brimming with their ideas, convinced that their masterpiece will resonate with everyone simply because 
        it excels in their sector or cleanly executes their vision.
      </p>
      
      <div className="mb-6 p-4 bg-teal-900/20 rounded-lg border-l-2 border-teal-400">
        <p className="text-emerald-200/90 mb-3">
          <strong className="text-teal-300">The Misconception:</strong> They believe that the power lies solely 
          in capturing the perfect moment on camera. However, this is only half the battle.
        </p>
        <p className="text-emerald-200/90">
          Even in the corporate world, the goal shouldn't be to appeal only to like-minded individuals. The 
          true challenge lies in engaging people from diverse backgrounds, industries, and thought processes.
        </p>
      </div>

      <p className="mb-6 text-emerald-100/90 text-lg italic text-center py-4">
        Whether they realize it or not, viewers are searching for a story that captivates them.
      </p>

      <h3 className="text-2xl font-bold text-emerald-300 mt-8 mb-4 flex items-center gap-3">
        <span className="text-3xl">🎵</span>
        Rhythm and Flow
      </h3>
      <p className="mb-4">
        People who choose to watch your video crave motion and rhythm. Much like a catchy new song that 
        inexplicably appeals to your ear, a well-crafted video flows, organizes, and synchronizes its elements 
        in a way that resonates with the viewer.
      </p>
      <p className="mb-6">
        The most impactful product videos don't just showcase features; they weave a compelling narrative that 
        synchronizes with the viewer's emotions and experiences.
      </p>

      <div className="my-8 grid md:grid-cols-2 gap-4">
        <div className="p-5 bg-emerald-800/30 rounded-lg border border-emerald-500/40">
          <h4 className="text-lg font-bold text-emerald-300 mb-2">❌ What Companies Think</h4>
          <p className="text-emerald-200/80 text-sm">
            Simple execution and clean footage are enough to engage viewers.
          </p>
        </div>
        <div className="p-5 bg-teal-800/30 rounded-lg border border-teal-500/40">
          <h4 className="text-lg font-bold text-teal-300 mb-2">✅ What Viewers Need</h4>
          <p className="text-emerald-200/80 text-sm">
            A spark of creativity that captures attention without overshadowing the message.
          </p>
        </div>
      </div>

      <h3 className="text-2xl font-bold text-emerald-300 mt-8 mb-4 flex items-center gap-3">
        <span className="text-3xl">✨</span>
        The Creative Balance
      </h3>
      <p className="mb-4">
        While many companies initially seek simplicity in their video content, they soon realize that viewers 
        need a spark to truly engage. Your audience should feel your creativity pop—without it overshadowing 
        your message.
      </p>
      
      <div className="mb-6 p-5 bg-gradient-to-br from-emerald-900/40 to-teal-900/40 rounded-xl border border-emerald-400/50">
        <p className="text-emerald-100 leading-relaxed">
          <strong className="text-emerald-300">Key Insight:</strong> In the video industry, it's often easier 
          to underdo than to overdo creative energy. This isn't to say that your ideas alone can't be engaging. 
          However, to reach a broader audience, you need content that compels viewers to sit down and immerse 
          themselves in your creation.
        </p>
      </div>

      <p className="mb-6 text-emerald-200/90">
        Technical proficiency can help, but without inventiveness, it risks coming across as soulless.
      </p>

      <h3 className="text-2xl font-bold text-emerald-300 mt-8 mb-4 flex items-center gap-3">
        <span className="text-3xl">🌊</span>
        The Power of Collaboration
      </h3>
      <p className="mb-6">
        By collaborating with someone who possesses the experience, understanding of storytelling, and technical 
        ability to execute, your video creations can truly transcend. These professionals can help your content 
        engage not just those seeking simplicity, but individuals from all walks of life.
      </p>

      <div className="mt-8 p-6 bg-gradient-to-br from-emerald-800/40 to-teal-900/40 rounded-xl border border-emerald-400/50">
        <h4 className="text-xl font-bold text-emerald-200 mb-3 flex items-center gap-2">
          <span>🎯</span> The Bottom Line
        </h4>
        <p className="text-emerald-100/90 leading-relaxed">
          The art of video storytelling is a powerful tool that, when wielded effectively, can elevate your 
          corporate message from mundane to memorable. It's an investment in expertise that can transform your 
          video content from mere information to captivating narratives that resonate with a diverse audience.
        </p>
      </div>

      <div className="mt-8 pt-6 border-t border-emerald-500/30 text-center">
        <div className="inline-block p-4 bg-emerald-900/20 rounded-lg">
          <p className="text-emerald-300 font-semibold mb-1">Remember:</p>
          <p className="text-emerald-200/80 italic">
            "Good videos inform. Great videos transform."
          </p>
        </div>
      </div>
    </div>
  )
},

{ 
  id: 49, 
  title: 'The New Success Algorithm', 
  category: 'articles', 
  year: '2024', 
  description: 'From working hard to working smart in the 2020s',
  image: '/articles/NewSuccess.jpg',
  content: (
    <div className="font-body">
      <div className="mb-8 p-6 bg-gradient-to-r from-emerald-900/30 to-teal-900/30 rounded-lg border border-emerald-500/30">
        <p className="text-emerald-200/90 italic text-lg leading-relaxed">
          Our world has undergone a dramatic shift. Not long ago, we were focused on pushing ourselves to 
          the limit—working tirelessly, sacrificing sleep, and training our minds to numb out the endless 
          "must-dos."
        </p>
      </div>

      <h3 className="text-2xl font-bold text-emerald-300 mt-8 mb-4 flex items-center gap-3">
        <span className="text-3xl">🔄</span>
        The Great Flip
      </h3>
      <p className="mb-4">
        But now, our era has flipped, and we've transitioned into a world where working smart takes precedence 
        over working hard. We take days off to build our dreams, and remote work has become the new norm.
      </p>
      <p className="mb-6">
        While this change has been brewing for over two decades, it's only fully manifested in the last three 
        to four years. This shift has introduced a new success algorithm, one that surprises those who mastered 
        the old ways.
      </p>

      <h3 className="text-2xl font-bold text-emerald-300 mt-8 mb-4 flex items-center gap-3">
        <span className="text-3xl">📅</span>
        The Old Algorithm: Early 2000s
      </h3>
      <p className="mb-4">
        In the early 2000s, many of us who grew up in the '90s watched our parents create stable foundations 
        by working at 100% of their physical ability, but often only 50-60% of their intellectual capacity.
      </p>
      
      <div className="mb-6 p-5 bg-emerald-900/20 border-l-4 border-emerald-400 rounded-r-lg">
        <p className="text-emerald-200/90 mb-3">
          This isn't to say our parents weren't smart—they simply followed the algorithm of the time, which 
          rewarded those who worked harder.
        </p>
        <ul className="space-y-2 text-emerald-200/80">
          <li className="flex items-start gap-2">
            <span className="text-emerald-400 mt-1">•</span>
            <span>Stayed late and woke up early</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-emerald-400 mt-1">•</span>
            <span>Juggled multiple jobs</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-emerald-400 mt-1">•</span>
            <span>Built assets over decades</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-emerald-400 mt-1">•</span>
            <span>Eventually owned a home and enjoyed secure retirement</span>
          </li>
        </ul>
      </div>

      <h3 className="text-2xl font-bold text-emerald-300 mt-8 mb-4 flex items-center gap-3">
        <span className="text-3xl">🧠</span>
        The New Algorithm: 2020s
      </h3>
      <p className="mb-6">
        The algorithm for success in the 2020s has arguably flipped. Now, it emphasizes working at 75% of 
        one's capabilities and 100% of one's intelligence.
      </p>

      <div className="my-8 grid md:grid-cols-2 gap-4">
        <div className="p-5 bg-emerald-800/30 rounded-lg border border-emerald-500/40">
          <h4 className="text-lg font-bold text-emerald-300 mb-3 flex items-center gap-2">
            <span>⏮️</span> Old Way (2000s)
          </h4>
          <div className="space-y-2 text-emerald-200/80">
            <p><strong className="text-emerald-400">Physical:</strong> 100%</p>
            <p><strong className="text-emerald-400">Mental:</strong> 50-60%</p>
            <p className="text-sm italic mt-3">Work harder, push through</p>
          </div>
        </div>
        <div className="p-5 bg-teal-800/30 rounded-lg border border-teal-500/40">
          <h4 className="text-lg font-bold text-teal-300 mb-3 flex items-center gap-2">
            <span>⏭️</span> New Way (2020s)
          </h4>
          <div className="space-y-2 text-emerald-200/80">
            <p><strong className="text-teal-400">Physical:</strong> 75%</p>
            <p><strong className="text-teal-400">Mental:</strong> 100%</p>
            <p className="text-sm italic mt-3">Work smarter, strategize</p>
          </div>
        </div>
      </div>

      <div className="mb-6 p-4 bg-teal-900/20 rounded-lg border-l-2 border-teal-400">
        <p className="text-emerald-200/90">
          <strong className="text-teal-300">Important Note:</strong> This doesn't mean hard work isn't 
          important—if you add an extra 20% effort, you'll likely find more success. But the priority now 
          is working smarter.
        </p>
      </div>

      <h3 className="text-2xl font-bold text-emerald-300 mt-8 mb-4 flex items-center gap-3">
        <span className="text-3xl">⚖️</span>
        The 100% Paradox
      </h3>
      <p className="mb-4">
        Of course, if you can give 100% in both areas, success is inevitable. However, working at 100% leaves 
        little room for anything else:
      </p>

      <div className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-3 bg-emerald-900/20 rounded-lg text-center border border-emerald-500/30">
          <span className="text-2xl mb-1 block">👨‍👩‍👧‍👦</span>
          <p className="text-emerald-200/80 text-sm">Family</p>
        </div>
        <div className="p-3 bg-emerald-900/20 rounded-lg text-center border border-emerald-500/30">
          <span className="text-2xl mb-1 block">🎨</span>
          <p className="text-emerald-200/80 text-sm">Hobbies</p>
        </div>
        <div className="p-3 bg-emerald-900/20 rounded-lg text-center border border-emerald-500/30">
          <span className="text-2xl mb-1 block">🏃‍♂️</span>
          <p className="text-emerald-200/80 text-sm">Exercise</p>
        </div>
        <div className="p-3 bg-emerald-900/20 rounded-lg text-center border border-emerald-500/30">
          <span className="text-2xl mb-1 block">🧘</span>
          <p className="text-emerald-200/80 text-sm">Well-being</p>
        </div>
      </div>

      <p className="mb-6 text-emerald-100/90 text-lg italic text-center py-4">
        Working smarter requires time and focus, while working hard demands energy and endurance—both need 
        inspiration.
      </p>

      <h3 className="text-2xl font-bold text-emerald-300 mt-8 mb-4 flex items-center gap-3">
        <span className="text-3xl">🤖</span>
        The Robot Reality
      </h3>
      <p className="mb-4">
        If you were a self-sufficient robot who could slave away for hours without ever needing reminders of 
        why you're doing it, then perhaps you could truly work at 100%.
      </p>
      
      <div className="mb-6 p-5 bg-gradient-to-br from-emerald-900/40 to-teal-900/40 rounded-xl border border-emerald-400/50">
        <p className="text-emerald-100 leading-relaxed mb-3">
          But in reality, this era is pushing us closer to becoming robotic humanoids, as people strain to 
          operate at full capacity and beyond.
        </p>
        <p className="text-emerald-200/90">
          Some are even considering technological enhancements like brain chips to maximize their already 
          efficient lifestyles.
        </p>
      </div>

      <h3 className="text-2xl font-bold text-emerald-300 mt-8 mb-4 flex items-center gap-3">
        <span className="text-3xl">🌊</span>
        Staying Human in a Digital Tide
      </h3>
      <p className="mb-4">
        So, how can ordinary people compete? How can our minds keep up with AI? If you're not utilizing AI, 
        how can you maintain a healthy lifestyle without getting lost in this new algorithm?
      </p>

      <div className="my-8 p-6 bg-emerald-900/20 border-l-4 border-emerald-400 rounded-r-lg">
        <p className="text-emerald-100 font-semibold text-lg mb-3">
          The truth is, the 2020s may be our last chance to live without being entirely consumed by technology.
        </p>
        <p className="text-emerald-200/80">
          Those friends who still don't know how to text back will probably need to learn. But in all 
          seriousness, if you think people are glued to their devices now, just wait until those devices 
          are fully integrated into their beings.
        </p>
      </div>

      <div className="mt-8 p-6 bg-gradient-to-br from-emerald-800/40 to-teal-900/40 rounded-xl border border-emerald-400/50">
        <h4 className="text-xl font-bold text-emerald-200 mb-3 flex items-center gap-2">
          <span>💭</span> Final Reflection
        </h4>
        <p className="text-emerald-100/90 leading-relaxed">
          We stand at a crossroads between the grind of the past and the intelligence of the future. The 
          question isn't whether to work hard or smart—it's how to balance both while staying human in an 
          increasingly automated world.
        </p>
      </div>

      <div className="mt-8 pt-6 border-t border-emerald-500/30 text-center">
        <div className="inline-block p-4 bg-emerald-900/20 rounded-lg">
          <p className="text-emerald-300 font-semibold mb-1">Remember:</p>
          <p className="text-emerald-200/80 italic">
            "Success is not about working yourself to death—it's about working yourself to life."
          </p>
        </div>
      </div>
    </div>
  )
},

// GRAPHICS
{ 
  id: 31, 
  category: 'graphics', 
  year: '2023', 
  image: '/graphics/graphicone.png'
},
{ 
  id: 32, 
  category: 'graphics', 
  year: '2023', 
  image: '/graphics/graphictwo.png'
},
{ 
  id: 50, 
  category: 'graphics', 
  year: '2024', 
  image: '/graphics/graphicthree.png'
},
{ 
  id: 51, 
  category: 'graphics', 
  year: '2024', 
  image: '/graphics/graphicfour.png'
},
{ 
  id: 52,  
  category: 'graphics', 
  year: '2023', 
  image: '/graphics/graphicfive.png'
},
{ 
  id: 53, 
  category: 'graphics', 
  year: '2023', 
  image: '/graphics/graphicsix.png'
},
{ 
  id: 54, 
  category: 'graphics', 
  year: '2023', 
  image: '/graphics/graphicseven.jpg'
},
{ 
  id: 55, 
  category: 'graphics', 
  year: '2023', 
  image: '/graphics/graphiceight.jpg'
},
{ 
  id: 56, 
  category: 'graphics', 
  year: '2023', 
  image: '/graphics/graphicnine.png'
},
{ 
  id: 57, 
  category: 'graphics', 
  year: '2023', 
  image: '/graphics/graphicten.png'
},


// BOOKS
{ 
  id: 33, 
  title: 'The Tides of the Twin Kings', 
  category: 'books', 
  year: '2025', 
  description: 'An epic fantasy tale of two kingdoms divided by the sea',
  image: '/photos/TTOTTK.png',
  synopsis: 'In a world where two kingdoms rule opposite shores of a mystical ocean, twin princes must navigate political intrigue, ancient magic, and their own conflicting destinies. When the tides begin to turn against the natural order, they discover their connection runs deeper than blood – their fates are tied to the very sea that separates them.',
  amazonLink: 'https://www.amazon.com/dp/B0GDKFSN3Q',
  
},
{ 
  id: 34, 
  title: 'The Phoenix Empire', 
  category: 'books', 
  year: '2025', 
  description: 'A science fiction journey through rebirth and revolution',
  image: '/books/book-two.jpg',
  synopsis: 'six decades after Earth\'s collapse, humanity has rebuilt civilization on the ashes of the old world. But the Phoenix Empire, humanity\'s greatest achievement, harbors a dark secret: every generation, the empire must burn and be reborn to survive. When a young engineer discovers the truth behind the cycles, she must decide whether to save the empire or let it die for good.',
  amazonLink: 'https://www.amazon.com/dp/B0GFFYSD5L',
  
},  
];