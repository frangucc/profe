import express from 'express';
import Anthropic from '@anthropic-ai/sdk';

const router = express.Router();
const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY,
});

// Formation templates with player positions
const FORMATIONS = {
  '4-3-3': {
    name: '4-3-3',
    positions: [
      { x: 0, y: 350, role: 'GK', number: 1 },
      { x: -120, y: 200, role: 'LB', number: 3 },
      { x: -40, y: 200, role: 'CB', number: 4 },
      { x: 40, y: 200, role: 'CB', number: 5 },
      { x: 120, y: 200, role: 'RB', number: 2 },
      { x: -80, y: 50, role: 'CM', number: 6 },
      { x: 0, y: 30, role: 'CM', number: 8 },
      { x: 80, y: 50, role: 'CM', number: 10 },
      { x: -100, y: -150, role: 'LW', number: 11 },
      { x: 0, y: -180, role: 'ST', number: 9 },
      { x: 100, y: -150, role: 'RW', number: 7 }
    ]
  },
  '4-4-2': {
    name: '4-4-2',
    positions: [
      { x: 0, y: 350, role: 'GK', number: 1 },
      { x: -120, y: 200, role: 'LB', number: 3 },
      { x: -40, y: 200, role: 'CB', number: 4 },
      { x: 40, y: 200, role: 'CB', number: 5 },
      { x: 120, y: 200, role: 'RB', number: 2 },
      { x: -100, y: 50, role: 'LM', number: 11 },
      { x: -40, y: 50, role: 'CM', number: 6 },
      { x: 40, y: 50, role: 'CM', number: 8 },
      { x: 100, y: 50, role: 'RM', number: 7 },
      { x: -50, y: -150, role: 'ST', number: 9 },
      { x: 50, y: -150, role: 'ST', number: 10 }
    ]
  },
  '4-2-3-1': {
    name: '4-2-3-1',
    positions: [
      { x: 0, y: 350, role: 'GK', number: 1 },
      { x: -120, y: 200, role: 'LB', number: 3 },
      { x: -40, y: 200, role: 'CB', number: 4 },
      { x: 40, y: 200, role: 'CB', number: 5 },
      { x: 120, y: 200, role: 'RB', number: 2 },
      { x: -50, y: 100, role: 'CDM', number: 6 },
      { x: 50, y: 100, role: 'CDM', number: 8 },
      { x: -100, y: -50, role: 'LW', number: 11 },
      { x: 0, y: -30, role: 'CAM', number: 10 },
      { x: 100, y: -50, role: 'RW', number: 7 },
      { x: 0, y: -180, role: 'ST', number: 9 }
    ]
  },
  '3-5-2': {
    name: '3-5-2',
    positions: [
      { x: 0, y: 350, role: 'GK', number: 1 },
      { x: -80, y: 200, role: 'CB', number: 4 },
      { x: 0, y: 210, role: 'CB', number: 5 },
      { x: 80, y: 200, role: 'CB', number: 2 },
      { x: -120, y: 50, role: 'LWB', number: 3 },
      { x: -60, y: 80, role: 'CM', number: 6 },
      { x: 0, y: 50, role: 'CM', number: 8 },
      { x: 60, y: 80, role: 'CM', number: 10 },
      { x: 120, y: 50, role: 'RWB', number: 7 },
      { x: -50, y: -150, role: 'ST', number: 9 },
      { x: 50, y: -150, role: 'ST', number: 11 }
    ]
  }
};

// Define Claude tools for soccer session building
const tools = [
  {
    name: 'create_formation',
    description: 'Creates a standard soccer formation with player positions. Use circles for our_team, triangles (pointing down) for opposing_team. Available formations: 4-3-3, 4-4-2, 4-2-3-1, 3-5-2',
    input_schema: {
      type: 'object',
      properties: {
        formation: {
          type: 'string',
          enum: ['4-3-3', '4-4-2', '4-2-3-1', '3-5-2'],
          description: 'The formation name (e.g., "4-3-3")'
        },
        pitch_type: {
          type: 'string',
          enum: ['full', 'attack', 'defense', 'training'],
          description: 'Which field to show: full, attack, defense, or training'
        },
        team: {
          type: 'string',
          enum: ['our_team', 'opposing_team'],
          description: 'our_team = circles, opposing_team = triangles pointing down'
        },
        color: {
          type: 'string',
          description: 'Hex color code from: #22c55e (green), #3b82f6 (blue), #ef4444 (red), #f59e0b (orange), #eab308 (yellow), #8b5cf6 (purple), #ec4899 (pink), #000000 (black), #ffffff (white)'
        }
      },
      required: ['formation', 'pitch_type', 'team']
    }
  },
  {
    name: 'add_player',
    description: 'Add a player marker to the field. Use circle for our_team, triangle (pointing down) for opposing_team',
    input_schema: {
      type: 'object',
      properties: {
        x: {
          type: 'number',
          description: 'X position on field (-300 to 300)'
        },
        y: {
          type: 'number',
          description: 'Y position on field (-400 to 400)'
        },
        team: {
          type: 'string',
          enum: ['our_team', 'opposing_team'],
          description: 'our_team = circle, opposing_team = triangle pointing down'
        },
        color: {
          type: 'string',
          description: 'Color from: #22c55e (green), #3b82f6 (blue), #ef4444 (red), #f59e0b (orange), #eab308 (yellow), #8b5cf6 (purple), #ec4899 (pink), #000000 (black), #ffffff (white)'
        },
        fill: {
          type: 'boolean',
          description: 'Whether the marker should be filled or outline only'
        },
        label: {
          type: 'string',
          description: 'Player number or label (optional)'
        }
      },
      required: ['x', 'y', 'team', 'color', 'fill']
    }
  },
  {
    name: 'add_cone',
    description: 'Add a training cone or marker to the field (triangle pointing UP)',
    input_schema: {
      type: 'object',
      properties: {
        x: {
          type: 'number',
          description: 'X position on field (-300 to 300)'
        },
        y: {
          type: 'number',
          description: 'Y position on field (-400 to 400)'
        },
        color: {
          type: 'string',
          description: 'Color from: #22c55e (green), #3b82f6 (blue), #ef4444 (red), #f59e0b (orange), #eab308 (yellow), #8b5cf6 (purple), #ec4899 (pink), #000000 (black), #ffffff (white)'
        }
      },
      required: ['x', 'y', 'color']
    }
  },
  {
    name: 'set_pitch_view',
    description: 'Change the pitch view to full field, attack half, defense half, or training grid',
    input_schema: {
      type: 'object',
      properties: {
        pitch_type: {
          type: 'string',
          enum: ['full', 'attack', 'defense', 'training'],
          description: 'The type of field view to display'
        }
      },
      required: ['pitch_type']
    }
  },
  {
    name: 'clear_field',
    description: 'Clear all shapes and players from the field',
    input_schema: {
      type: 'object',
      properties: {}
    }
  }
];

// System prompt for soccer coaching assistant
const SYSTEM_PROMPT = `You are an expert soccer coaching assistant specializing in creating training sessions, tactical formations, and drills. You help coaches design effective practice sessions using a digital clipboard.

FIELD SETUP RULES:
- OUR TEAM = CIRCLES (filled or outline)
- OPPOSING TEAM = TRIANGLES pointing DOWN (▼)
- TRAINING CONES = TRIANGLES pointing UP (▲)
- Available colors: #22c55e (green), #3b82f6 (blue), #ef4444 (red), #f59e0b (orange), #eab308 (yellow), #8b5cf6 (purple), #ec4899 (pink), #000000 (black), #ffffff (white)

CRITICAL: When user says "opposing team" or "opposition" or "defenders" (in context of them defending against us), you MUST use team='opposing_team' which creates TRIANGLES pointing DOWN.

PITCH TYPES:
1. "full" - Full field (both halves, both goals) - use for full 11v11 formations or transition drills
2. "attack" - Attacking half only (opponent's goal visible) - use for attacking drills and offensive formations
3. "defense" - Defensive half only (our goal visible) - use for defensive drills and defensive formations
4. "training" - Training grid (no goals, divided into thirds) - use for possession drills, passing patterns, small-sided games

FIELD POSITIONING:
- When user specifies a pitch type, ONLY place players in that area
- Attacking field: Players should be in attacking positions (higher Y values, closer to opponent's goal)
- Defensive field: Players should be in defensive positions (lower Y values, closer to our goal)
- Full field: Can use entire field
- Training field: Use for small-sided games and drills (no formal formations)

CAPABILITIES:
- Create standard formations (4-3-3, 4-4-2, 4-2-3-1, 3-5-2)
- Place our team (circles) and opposing team (triangles pointing down)
- Add training cones (triangles pointing up)
- Design drills for different age groups and skill levels
- Explain tactical concepts and positioning

COACHING KNOWLEDGE:
- Understand player positions, roles, and responsibilities
- Know common training progressions (warm-up → technique → small-sided games → cool-down)
- Adapt drills based on age: U8-U10 (fun, basic skills), U12-U14 (technical development), U16+ (tactical complexity)
- Consider group size: adjust drills for 6v6, 8v8, or 11v11

INTERACTION STYLE:
- Ask clarifying questions about: age group, skill level, session focus, number of players, which field type they want
- Suggest appropriate formations based on team characteristics
- Explain WHY you're placing players/cones in specific positions
- Use the correct pitch type for the drill (attacking drills → "attack", defensive drills → "defense")
- Offer drill variations and progressions
- Be encouraging and educational

When users ask for formations or drills:
1. Ask relevant questions if details are missing (especially which pitch type)
2. Use tools to build the visual setup on the correct field type
3. Use circles for our team, triangles (pointing down) for opposing team
4. Explain the tactical purpose
5. Suggest progressions or variations

EXAMPLES OF CORRECT TOOL USAGE:
- "make a 4-3-3 formation" → create_formation(formation="4-3-3", team="our_team", pitch_type="full", color="#22c55e")
- "create opposing team 4-4-2 in yellow" → create_formation(formation="4-4-2", team="opposing_team", pitch_type="full", color="#eab308")
- "add a red opposing defender" → add_player(team="opposing_team", color="#ef4444", fill=true, x=0, y=200)
- "place our striker in green" → add_player(team="our_team", color="#22c55e", fill=true, x=0, y=-180)
- "add orange cones" → add_cone(color="#f59e0b", x=50, y=100)

IMPORTANT: If user doesn't specify pitch type, ask them which field view they want (full, attack, defense, or training).`;

// POST /api/sessions/chat - Main chat endpoint
router.post('/chat', async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    // Call Claude API (non-streaming first to handle tools properly)
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      tools: tools,
      messages: messages
    });

    console.log('Claude response:', JSON.stringify(response, null, 2));

    // Check if Claude wants to use tools
    if (response.stop_reason === 'tool_use') {
      // Extract tool calls
      const toolCalls = response.content.filter(block => block.type === 'tool_use');

      // Execute all tool calls and collect results
      const toolResults = [];
      for (const toolCall of toolCalls) {
        console.log('Executing tool:', toolCall.name, 'with input:', toolCall.input);

        const result = await executeToolDirectly(toolCall.name, toolCall.input);
        toolResults.push({
          type: 'tool_result',
          tool_use_id: toolCall.id,
          content: JSON.stringify(result)
        });
      }

      // Send tool executions to client
      res.json({
        type: 'tool_execution',
        toolCalls: toolCalls,
        toolResults: toolResults,
        assistantMessage: response.content.find(block => block.type === 'text')?.text || '',
        fullResponse: response
      });
    } else {
      // No tools needed, just return the text response
      const textContent = response.content.find(block => block.type === 'text')?.text || '';
      res.json({
        type: 'text_only',
        content: textContent,
        fullResponse: response
      });
    }

  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Helper function to execute tools directly
async function executeToolDirectly(toolName, toolInput) {
  let result = { shapes: [], pitchType: null, message: '' };

  switch (toolName) {
    case 'create_formation':
      const formation = FORMATIONS[toolInput.formation];
      if (!formation) {
        return { error: 'Formation not found' };
      }

      const isOurTeam = toolInput.team === 'our_team';
      const formationColor = toolInput.color || (isOurTeam ? '#22c55e' : '#ef4444');

      result.shapes = formation.positions.map((pos, idx) => ({
        id: Date.now() + idx,
        type: isOurTeam ? 'circle' : 'triangle',
        x: pos.x,
        y: pos.y,
        color: formationColor,
        fill: true,
        rotation: isOurTeam ? 0 : 180,
        label: pos.number?.toString() || ''
      }));
      result.pitchType = toolInput.pitch_type;
      result.message = `Created ${toolInput.formation} formation for ${toolInput.team}`;
      break;

    case 'add_player':
      const isPlayerOurTeam = toolInput.team === 'our_team';
      result.shapes = [{
        id: Date.now(),
        type: isPlayerOurTeam ? 'circle' : 'triangle',
        x: toolInput.x,
        y: toolInput.y,
        color: toolInput.color,
        fill: toolInput.fill,
        rotation: isPlayerOurTeam ? 0 : 180,
        label: toolInput.label || ''
      }];
      result.message = `Added ${toolInput.team} player to field`;
      break;

    case 'add_cone':
      result.shapes = [{
        id: Date.now(),
        type: 'triangle',
        x: toolInput.x,
        y: toolInput.y,
        color: toolInput.color,
        fill: true,
        rotation: 0
      }];
      result.message = 'Added cone to field';
      break;

    case 'set_pitch_view':
      result.pitchType = toolInput.pitch_type;
      result.message = `Changed view to ${toolInput.pitch_type}`;
      break;

    case 'clear_field':
      result.shapes = 'CLEAR';
      result.message = 'Cleared field';
      break;

    default:
      return { error: 'Unknown tool' };
  }

  return result;
}

// POST /api/sessions/execute-tool - Execute a tool call and return shapes
router.post('/execute-tool', async (req, res) => {
  try {
    const { toolName, toolInput } = req.body;

    let result = { shapes: [], pitchType: null, message: '' };

    switch (toolName) {
      case 'create_formation':
        const formation = FORMATIONS[toolInput.formation];
        if (!formation) {
          return res.status(400).json({ error: 'Formation not found' });
        }

        const isOurTeam = toolInput.team === 'our_team';
        const formationColor = toolInput.color || (isOurTeam ? '#22c55e' : '#ef4444');

        result.shapes = formation.positions.map((pos, idx) => ({
          id: Date.now() + idx,
          type: isOurTeam ? 'circle' : 'triangle',
          x: pos.x,
          y: pos.y,
          color: formationColor,
          fill: true,
          rotation: isOurTeam ? 0 : 180, // Opposing team triangles point down
          label: pos.number?.toString() || ''
        }));
        result.pitchType = toolInput.pitch_type;
        result.message = `Created ${toolInput.formation} formation for ${toolInput.team}`;
        break;

      case 'add_player':
        const isPlayerOurTeam = toolInput.team === 'our_team';
        result.shapes = [{
          id: Date.now(),
          type: isPlayerOurTeam ? 'circle' : 'triangle',
          x: toolInput.x,
          y: toolInput.y,
          color: toolInput.color,
          fill: toolInput.fill,
          rotation: isPlayerOurTeam ? 0 : 180, // Opposing team triangles point down
          label: toolInput.label || ''
        }];
        result.message = `Added ${toolInput.team} player to field`;
        break;

      case 'add_cone':
        result.shapes = [{
          id: Date.now(),
          type: 'triangle',
          x: toolInput.x,
          y: toolInput.y,
          color: toolInput.color,
          fill: true,
          rotation: 0 // Cones point up
        }];
        result.message = 'Added cone to field';
        break;

      case 'set_pitch_view':
        result.pitchType = toolInput.pitch_type;
        result.message = `Changed view to ${toolInput.pitch_type}`;
        break;

      case 'clear_field':
        result.shapes = 'CLEAR';
        result.message = 'Cleared field';
        break;

      default:
        return res.status(400).json({ error: 'Unknown tool' });
    }

    res.json(result);

  } catch (error) {
    console.error('Tool execution error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
