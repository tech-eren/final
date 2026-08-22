import { issueService } from './mock/issueService';
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
  sendMessage: async (query: string, userId: string = 'usr_1'): Promise<CivicAIMessage> => {
    return new Promise((resolve) => {
      setTimeout(async () => {
        const q = query.toLowerCase();
        
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

  getWelcomeMessage: (): CivicAIMessage => {
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
