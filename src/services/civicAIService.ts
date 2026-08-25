import { issueService } from './issueService';
import type { Issue } from '../types';

export type AIMessageType = 'text' | 'suggested_prompts' | 'report_preview' | 'issue_list' | 'tracking_timeline' | 'summary';

export interface CivicAIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  type?: AIMessageType;
  data?: any; // Context-dependent payload (e.g., issues list, report preview data)
  timestamp: Date;
}

export const civicAIService = {
  // Simulates a backend AI request
  sendMessage: async (query: string, userId: string = 'usr_1', role: 'CITIZEN' | 'AUTHORITY' = 'CITIZEN'): Promise<CivicAIMessage> => {
    return new Promise((resolve) => {
      setTimeout(async () => {
        const q = query.toLowerCase();
        
        if (role === 'AUTHORITY') {
          if (q.includes('summar') || q.includes('pending') || q.includes('status')) {
            resolve({
              id: `ai_${Date.now()}`,
              role: 'assistant',
              content: "Here is a quick summary of the current city infrastructure status:",
              type: 'summary',
              data: {
                major: [
                  "Road damage — 18 active reports",
                  "Broken Streetlights — 12 active reports",
                  "Sanitation — 9 active reports"
                ],
                critical: "There are currently 0 critical issues. 1 issue is In Progress.",
                affectedArea: "Tarapur & Central Road"
              },
              timestamp: new Date()
            });
            return;
          }

          if (q.includes('hotspot') || q.includes('area')) {
            resolve({
              id: `ai_${Date.now()}`,
              role: 'assistant',
              content: "The primary hotspot for unresolved issues is the **Tarapur** sector, specifically along Central Road. Deploying Public Works to this area is recommended.",
              type: 'text',
              timestamp: new Date()
            });
            return;
          }

          if (q.includes('draft') || q.includes('email') || q.includes('update')) {
             resolve({
              id: `ai_${Date.now()}`,
              role: 'assistant',
              content: "**Draft Update for Public Works:**\n\nSubject: Urgent - Infrastructure Repairs Required in Tarapur Sector\n\nTeam,\nPlease prioritize the patching of potholes along Central Road (18 active reports) and inspect the streetlights on Park Road (12 active reports).",
              type: 'text',
              timestamp: new Date()
            });
            return;
          }

          if (q.includes('resolution') || q.includes('average') || q.includes('time')) {
             resolve({
              id: `ai_${Date.now()}`,
              role: 'assistant',
              content: "The average resolution time over the last 7 days is **24.5 hours**. This is a 12% improvement from last week.",
              type: 'text',
              timestamp: new Date()
            });
            return;
          }

          resolve({
            id: `ai_${Date.now()}`,
            role: 'assistant',
            content: "I'm your authority assistant. You can ask me to summarize pending issues, identify hotspots, or draft updates for your departments.",
            type: 'text',
            timestamp: new Date()
          });
          return;
        }

        // --- CITIZEN LOGIC BELOW ---
        
        // 1. Report Intent
        if (q.includes('report') && (q.includes('help') || q.includes('pothole') || q.includes('issue') || q.includes('street'))) {
          if (q.includes('pothole') || q.includes('street')) {
            resolve({
              id: `ai_${Date.now()}`,
              role: 'assistant',
              content: 'I can help you report that. Based on what you said, here is a preview of the report. You can review it before submitting:',
              type: 'report_preview',
              data: {
                category: 'Infrastructure',
                issue: q.includes('pothole') ? 'Pothole' : 'Street Issue',
                severity: 'High',
                location: 'Current Location',
                description: `A ${q.includes('pothole') ? 'pothole' : 'street issue'} has been identified that requires maintenance.`
              },
              timestamp: new Date()
            });
            return;
          }
          
          resolve({
            id: `ai_${Date.now()}`,
            role: 'assistant',
            content: 'I can help you report an issue. What exactly is the problem, and where is it located?',
            type: 'text',
            timestamp: new Date()
          });
          return;
        }

        // 2. Search Intent
        if (q.includes('find') || q.includes('search') || (q.includes('any') && q.includes('near'))) {
          const allIssues = await issueService.getAllIssues();
          const keyword = q.includes('pothole') ? 'pothole' : q.includes('water') ? 'water' : '';
          
          let found = allIssues;
          if (keyword) {
            found = allIssues.filter(i => 
              i.category.toLowerCase().includes(keyword) || 
              i.description.toLowerCase().includes(keyword)
            );
          }
          
          resolve({
            id: `ai_${Date.now()}`,
            role: 'assistant',
            content: `I found ${found.length} issues matching your criteria near you.`,
            type: 'issue_list',
            data: { issues: found.slice(0, 3) }, // limit to 3 for chat UI
            timestamp: new Date()
          });
          return;
        }

        // 3. Trending Intent
        if (q.includes('trend') || q.includes('what\'s happening')) {
          resolve({
            id: `ai_${Date.now()}`,
            role: 'assistant',
            content: '🚨 **Infrastructure** is currently the most reported category in your area, followed by Waste Management. There are several high-severity reports requiring immediate attention.',
            type: 'text',
            timestamp: new Date()
          });
          return;
        }

        // 4. Tracking Intent
        if (q.includes('track') || q.includes('status')) {
          const allIssues = await issueService.getAllIssues();
          const userIssues = allIssues.filter(i => i.reportedBy === userId);
          
          if (userIssues.length > 0) {
            const issue = userIssues[0]; // grab most recent
            resolve({
              id: `ai_${Date.now()}`,
              role: 'assistant',
              content: `Here is the status of your most recent report: **${issue.category}**`,
              type: 'tracking_timeline',
              data: { issue },
              timestamp: new Date()
            });
          } else {
            resolve({
              id: `ai_${Date.now()}`,
              role: 'assistant',
              content: "I couldn't find any recent reports filed by you.",
              type: 'text',
              timestamp: new Date()
            });
          }
          return;
        }
        
        // 5. Summary Intent
        if (q.includes('summar') || q.includes('overview')) {
          resolve({
            id: `ai_${Date.now()}`,
            role: 'assistant',
            content: "Here is a quick summary of unresolved civic issues in your area:",
            type: 'summary',
            data: {
              major: [
                "Road damage — 18 reports",
                "Waterlogging — 12 reports",
                "Waste management — 9 reports"
              ],
              critical: "3 high-severity issues remain unresolved.",
              affectedArea: "Silchar Central & Tarapur"
            },
            timestamp: new Date()
          });
          return;
        }
        
        // 6. Department Guidance
        if (q.includes('who') || q.includes('department') || q.includes('authority')) {
          resolve({
            id: `ai_${Date.now()}`,
            role: 'assistant',
            content: "This appears to be a municipal issue. It should generally be directed to the local municipal corporation or public works department.",
            type: 'text',
            timestamp: new Date()
          });
          return;
        }

        // Fallback General Response
        resolve({
          id: `ai_${Date.now()}`,
          role: 'assistant',
          content: "I'm not quite sure how to help with that yet. Try asking me to help report an issue, find trending problems, or check your complaint status.",
          type: 'text',
          timestamp: new Date()
        });
      }, 1000); // simulate network latency
    });
  },

  getWelcomeMessage: (role: 'CITIZEN' | 'AUTHORITY' = 'CITIZEN'): CivicAIMessage => {
    if (role === 'AUTHORITY') {
      return {
        id: `ai_welcome_auth`,
        role: 'assistant',
        content: "👋 Welcome back! I'm UbiqAI. I can help you triage infrastructure problems, analyze incident data, and assist in dispatching field workers efficiently.",
        type: 'suggested_prompts',
        data: {
          prompts: [
            "📊 Summarize critical pending issues",
            "🗺️ Identify infrastructure hotspots",
            "📝 Draft an update for Public Works",
            "⏱️ What is our average resolution time?"
          ]
        },
        timestamp: new Date()
      };
    }

    return {
      id: `ai_welcome`,
      role: 'assistant',
      content: "👋 Hi! I'm UbiqAI. I can help you report civic issues, find existing complaints, understand what's happening in your area, and navigate the platform.",
      type: 'suggested_prompts',
      data: {
        prompts: [
          "📝 Help me report an issue",
          "🔍 Find issues near me",
          "📊 What's trending in my area?",
          "📍 Track my complaint",
          "🏛️ Which department handles this issue?"
        ]
      },
      timestamp: new Date()
    };
  }
};
