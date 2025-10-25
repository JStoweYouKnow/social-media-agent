"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import {
  BookOpen,
  CalendarDays,
  ClipboardList,
  Coffee,
  Sun,
  Dumbbell,
  Home,
  Heart,
  Moon,
} from "lucide-react";

const tabs = [
  { id: "monday", label: "Mon", icon: <Sun className="w-4 h-4" />, tooltip: "Monday - Weekly planning and priorities" },
  { id: "tuesday", label: "Tue", icon: <CalendarDays className="w-4 h-4" />, tooltip: "Tuesday - Content creation focus" },
  { id: "wednesday", label: "Wed", icon: <ClipboardList className="w-4 h-4" />, tooltip: "Wednesday - Midweek review and engagement" },
  { id: "thursday", label: "Thu", icon: <Coffee className="w-4 h-4" />, tooltip: "Thursday - Growth and experimentation" },
  { id: "friday", label: "Fri", icon: <BookOpen className="w-4 h-4" />, tooltip: "Friday - Weekly reflection and analytics" },
  { id: "saturday", label: "Sat", icon: <Heart className="w-4 h-4" />, tooltip: "Saturday - Weekend content and community" },
  { id: "sunday", label: "Sun", icon: <Moon className="w-4 h-4" />, tooltip: "Sunday - Next week preparation" },
];

export default function PlannerTabs() {
  const [activeTab, setActiveTab] = useState("monday");
  const [notes, setNotes] = useState<Record<string, string>>({});

  // Load saved notes on mount
  useEffect(() => {
    const stored = localStorage.getItem("plannerNotes");
    if (stored) setNotes(JSON.parse(stored));
  }, []);

  // Save notes to local storage when updated
  useEffect(() => {
    localStorage.setItem("plannerNotes", JSON.stringify(notes));
  }, [notes]);

  const handleChange = (tab: string, value: string) => {
    setNotes((prev) => ({ ...prev, [tab]: value }));
  };

  const renderPageContent = (day: string) => {
    switch (day) {
      case "monday":
        return (
          <>
            <h3 className="planner-header text-2xl">Monday Focus</h3>
            <p className="text-planner-text-medium mb-4 text-sm leading-relaxed">
              Start your week with intention. Set weekly content priorities, plan your posting schedule,
              and establish goals that align with your brand vision.
            </p>
            <div className="mb-4 p-4 bg-planner-page/50 border-l-4 border-planner-accent rounded-sm">
              <p className="text-xs font-bold text-planner-text mb-2 uppercase tracking-wider">Weekly Planning Tips:</p>
              <ul className="text-sm text-planner-text-medium space-y-1 list-disc list-inside">
                <li>List your top 3 content priorities for this week</li>
                <li>Review last week's performance and engagement</li>
                <li>Schedule time blocks for content creation</li>
                <li>Set engagement goals for each platform</li>
              </ul>
            </div>
            <div className="planner-divider"></div>
            <textarea
              value={notes[day] || ""}
              onChange={(e) => handleChange(day, e.target.value)}
              placeholder="My Weekly Content Priorities:&#10;&#10;1. ____________________________________&#10;   Goal: ________________________________&#10;&#10;2. ____________________________________&#10;   Goal: ________________________________&#10;&#10;3. ____________________________________&#10;   Goal: ________________________________&#10;&#10;Content Ideas for This Week:&#10;• &#10;• &#10;• &#10;&#10;Engagement Goals:&#10;Instagram: _____ Daily: _____&#10;LinkedIn: _____ Daily: _____"
              className="textarea-planner planner-ruled-bg"
              rows={12}
            />
          </>
        );

      case "tuesday":
        return (
          <>
            <h3 className="planner-header text-2xl">Tuesday Momentum</h3>
            <p className="text-planner-text-medium mb-4 text-sm leading-relaxed">
              Build momentum with content creation. Focus on producing high-quality posts and
              optimizing your workflow for the week ahead.
            </p>
            <div className="mb-4 p-4 bg-planner-page/50 border-l-4 border-planner-accent rounded-sm">
              <p className="text-xs font-bold text-planner-text mb-2 uppercase tracking-wider">Content Creation Focus:</p>
              <ul className="text-sm text-planner-text-medium space-y-1 list-disc list-inside">
                <li>Create 2-3 posts for this week's schedule</li>
                <li>Batch similar content types together</li>
                <li>Draft captions and select hashtags</li>
                <li>Prepare images or graphics</li>
              </ul>
            </div>
            <div className="planner-divider"></div>
            <textarea
              value={notes[day] || ""}
              onChange={(e) => handleChange(day, e.target.value)}
              placeholder="Today's Content Tasks:&#10;&#10;Posts to Create:&#10;1. ____________________________________&#10;2. ____________________________________&#10;3. ____________________________________&#10;&#10;Caption Ideas:&#10;• &#10;• &#10;&#10;Hashtags to Use:&#10;#___________ #___________ #___________&#10;&#10;Graphics/Images Needed:&#10;• &#10;• "
              className="textarea-planner planner-ruled-bg"
              rows={12}
            />
          </>
        );

      case "wednesday":
        return (
          <>
            <h3 className="planner-header text-2xl">Wednesday Check-In</h3>
            <p className="text-planner-text-medium mb-4 text-sm leading-relaxed">
              Midweek review and adjustment. Check your progress, engage with your community,
              and refine your content strategy based on early-week performance.
            </p>
            <div className="mb-4 p-4 bg-planner-page/50 border-l-4 border-planner-accent rounded-sm">
              <p className="text-xs font-bold text-planner-text mb-2 uppercase tracking-wider">Midweek Review:</p>
              <ul className="text-sm text-planner-text-medium space-y-1 list-disc list-inside">
                <li>Review Monday/Tuesday post performance</li>
                <li>Respond to comments and messages</li>
                <li>Adjust content plan if needed</li>
                <li>Engage with your target audience</li>
              </ul>
            </div>
            <div className="planner-divider"></div>
            <textarea
              value={notes[day] || ""}
              onChange={(e) => handleChange(day, e.target.value)}
              placeholder="Midweek Progress Check:&#10;&#10;Posts Published So Far:&#10;✓ ____________________________________&#10;✓ ____________________________________&#10;&#10;What's Working Well:&#10;• &#10;• &#10;&#10;What Needs Adjustment:&#10;• &#10;• &#10;&#10;Engagement Summary:&#10;New followers: _____&#10;Comments replied to: _____&#10;Best performing post: ________________&#10;&#10;Adjustments for Rest of Week:&#10;"
              className="textarea-planner planner-ruled-bg"
              rows={12}
            />
          </>
        );

      case "thursday":
        return (
          <>
            <h3 className="planner-header text-2xl">Thursday Growth</h3>
            <p className="text-planner-text-medium mb-4 text-sm leading-relaxed">
              Experiment and innovate. Try new content formats, test different posting times,
              or explore trending topics in your niche.
            </p>
            <div className="mb-4 p-4 bg-planner-page/50 border-l-4 border-planner-accent rounded-sm">
              <p className="text-xs font-bold text-planner-text mb-2 uppercase tracking-wider">Growth & Innovation:</p>
              <ul className="text-sm text-planner-text-medium space-y-1 list-disc list-inside">
                <li>Try a new content format (Reels, Stories, Carousels)</li>
                <li>Experiment with different hashtag sets</li>
                <li>Test posting at a new time</li>
                <li>Research trending topics in your industry</li>
              </ul>
            </div>
            <div className="planner-divider"></div>
            <textarea
              value={notes[day] || ""}
              onChange={(e) => handleChange(day, e.target.value)}
              placeholder="Growth Experiments:&#10;&#10;New Format to Try:&#10;____________________________________&#10;&#10;Trending Topics to Explore:&#10;• &#10;• &#10;&#10;A/B Testing Ideas:&#10;Test A: ____________________________&#10;Test B: ____________________________&#10;&#10;Learning Goals:&#10;• Study: __________________________&#10;• Apply: ___________________________&#10;&#10;Inspiration & Ideas:&#10;"
              className="textarea-planner planner-ruled-bg"
              rows={12}
            />
          </>
        );

      case "friday":
        return (
          <>
            <h3 className="planner-header text-2xl">Friday Reflection</h3>
            <p className="text-planner-text-medium mb-4 text-sm leading-relaxed">
              Wrap up your content week. Review analytics, celebrate wins, and prepare
              weekend content to keep your audience engaged.
            </p>
            <div className="mb-4 p-4 bg-planner-page/50 border-l-4 border-planner-accent rounded-sm">
              <p className="text-xs font-bold text-planner-text mb-2 uppercase tracking-wider">Week-End Review:</p>
              <ul className="text-sm text-planner-text-medium space-y-1 list-disc list-inside">
                <li>Analyze this week's content performance</li>
                <li>Celebrate your wins (big and small!)</li>
                <li>Schedule weekend posts if needed</li>
                <li>Note lessons learned for next week</li>
              </ul>
            </div>
            <div className="planner-divider"></div>
            <textarea
              value={notes[day] || ""}
              onChange={(e) => handleChange(day, e.target.value)}
              placeholder="Weekly Wins & Reflection:&#10;&#10;This Week's Accomplishments:&#10;✓ ____________________________________&#10;✓ ____________________________________&#10;✓ ____________________________________&#10;&#10;Best Performing Content:&#10;Post: ________________________________&#10;Engagement: _____ Reach: _____&#10;&#10;Key Lessons Learned:&#10;• &#10;• &#10;&#10;To Improve Next Week:&#10;• &#10;• &#10;&#10;Weekend Content Plan:&#10;"
              className="textarea-planner planner-ruled-bg"
              rows={12}
            />
          </>
        );

      case "saturday":
        return (
          <>
            <h3 className="planner-header text-2xl">Saturday Recharge</h3>
            <p className="text-planner-text-medium mb-4 text-sm leading-relaxed">
              Focus on lighter content and community engagement. Share behind-the-scenes moments,
              user-generated content, or casual updates that connect with your audience.
            </p>
            <div className="mb-4 p-4 bg-planner-page/50 border-l-4 border-planner-accent rounded-sm">
              <p className="text-xs font-bold text-planner-text mb-2 uppercase tracking-wider">Weekend Content Ideas:</p>
              <ul className="text-sm text-planner-text-medium space-y-1 list-disc list-inside">
                <li>Share behind-the-scenes content</li>
                <li>Post user-generated content or testimonials</li>
                <li>Engage authentically with your community</li>
                <li>Keep it light and relatable</li>
              </ul>
            </div>
            <div className="planner-divider"></div>
            <textarea
              value={notes[day] || ""}
              onChange={(e) => handleChange(day, e.target.value)}
              placeholder="Saturday Content Plan:&#10;&#10;Casual Content Ideas:&#10;• Behind-the-scenes: __________________&#10;• Fun fact or tip: ____________________&#10;• Community spotlight: ________________&#10;&#10;Engagement Activities:&#10;• Reply to DMs: ___ Done? ☐&#10;• Comment on 10 posts: Done? ☐&#10;• Share user content: Done? ☐&#10;&#10;Personal Notes:&#10;What brings me joy today:&#10;&#10;&#10;Energy check: ___/10"
              className="textarea-planner planner-ruled-bg"
              rows={12}
            />
          </>
        );

      case "sunday":
        return (
          <>
            <h3 className="planner-header text-2xl">Sunday Reset</h3>
            <p className="text-planner-text-medium mb-4 text-sm leading-relaxed">
              Prepare for success. Review the upcoming week, brainstorm content ideas,
              and set yourself up for a productive Monday start.
            </p>
            <div className="mb-4 p-4 bg-planner-page/50 border-l-4 border-planner-accent rounded-sm">
              <p className="text-xs font-bold text-planner-text mb-2 uppercase tracking-wider">Sunday Prep:</p>
              <ul className="text-sm text-planner-text-medium space-y-1 list-disc list-inside">
                <li>Preview next week's calendar and deadlines</li>
                <li>Brainstorm content ideas for the week</li>
                <li>Gather resources you'll need (images, links, etc.)</li>
                <li>Set 1-2 big goals for the week ahead</li>
              </ul>
            </div>
            <div className="planner-divider"></div>
            <textarea
              value={notes[day] || ""}
              onChange={(e) => handleChange(day, e.target.value)}
              placeholder="Next Week Preparation:&#10;&#10;Big Goals for Next Week:&#10;1. ____________________________________&#10;2. ____________________________________&#10;&#10;Content Ideas to Explore:&#10;• &#10;• &#10;• &#10;&#10;Resources to Gather:&#10;☐ Images: ____________________________&#10;☐ Articles: ___________________________&#10;☐ Graphics: ___________________________&#10;&#10;Upcoming Deadlines:&#10;• &#10;• &#10;&#10;Intention for the Week:&#10;"
              className="textarea-planner planner-ruled-bg"
              rows={12}
            />
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="planner-section overflow-hidden relative">
      {/* Bookmark Ribbon */}
      <div className="absolute right-4 top-0 w-3 h-12 bg-planner-accent rounded-b-md shadow-md z-20"></div>

      <div className="flex flex-col md:flex-row">
        {/* Tabs */}
        <div className="flex md:flex-col bg-planner-sidebar border-b md:border-b-0 md:border-r-2 border-planner-text">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              title={tab.tooltip}
              className={clsx(
                "flex items-center gap-2 px-5 py-4 font-medium transition-all duration-200 relative uppercase tracking-wider text-xs",
                "hover:bg-planner-page/50",
                activeTab === tab.id
                  ? "bg-planner-page border-l-4 md:border-l-4 border-planner-text text-planner-text font-bold"
                  : "text-planner-text-muted border-l-4 md:border-l-4 border-transparent"
              )}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Page Content */}
        <div className="flex-1 bg-planner-page p-6 md:p-10 relative overflow-hidden min-h-[500px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="relative z-10"
            >
              {renderPageContent(activeTab)}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
