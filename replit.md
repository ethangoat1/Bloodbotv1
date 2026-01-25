# replit.md

## Overview

This is a Facebook Messenger chatbot built on the Mirai bot framework. The bot provides various commands and automated event handling for Facebook group management, including user interactions, group moderation, anti-spam features, and entertainment utilities. The primary language interface is Arabic, targeting Arabic-speaking users.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Core Framework
- **Mirai Bot Framework**: The bot uses a modular command/event system based on the Mirai Facebook bot architecture
- **FCA (Facebook Chat API)**: Uses unofficial Facebook Chat API libraries (`@xaviabot/fca-unofficial`, `@dongdev/fca-unofficial`, `fca-prjvt`, `meta-horizonn`) to interact with Facebook Messenger
- **Entry Point**: `index.js` (obfuscated) starts the bot, with `main.js` containing core logic (also obfuscated)

### Module System
- **Commands** (`modules/commands/`): Individual command modules with standardized config exports including name, version, permissions, description, usage, and cooldowns
- **Events** (`modules/events/`): Event listener modules that respond to Facebook events like user joins, leaves, nickname changes, and message events
- **Handlers** (`includes/handle/`): Core handlers for processing commands, events, replies, reactions, and database operations

### Database Architecture
- **ORM**: Sequelize with SQLite storage (`data.sqlite`)
- **Models**: Three primary models:
  - `Users`: Stores user data (userID, name, gender, custom data JSON)
  - `Threads`: Stores group/thread data (threadID, threadInfo JSON, custom data JSON)
  - `Currencies`: Stores user economy data (userID, money, exp, custom data JSON)
- **Controllers**: Abstraction layer in `includes/controllers/` providing CRUD operations for each model

### Authentication
- **App State**: Facebook session maintained via `appstate.json` containing authentication cookies
- **Admin System**: Configurable admin list in `config.json` with permission levels (0=user, 1=group admin, 2=bot admin)

### Configuration
- **Main Config** (`config.json`): Bot settings including language, prefix, admin IDs, database paths, FCA options
- **FCA Config** (`fca-config.json`, `includes/FastConfigFca.json`): Facebook API specific settings including MQTT, auto-update, security features

### Web Interface
- **Express Server**: Basic HTML status page (`index.html`) showing bot status
- Uses Express with security middleware (helmet, cors, rate-limiting)

## External Dependencies

### Facebook API Libraries
- `@xaviabot/fca-unofficial`, `@dongdev/fca-unofficial`, `fca-prjvt`, `meta-horizonn`: Unofficial Facebook Messenger API clients

### Core Dependencies
- `sequelize`: ORM for SQLite database
- `express`: Web server for status page
- `axios`: HTTP client for external API calls
- `moment-timezone`: Date/time handling with timezone support
- `fs-extra`: Enhanced file system operations

### Media Processing
- `canvas`, `jimp`: Image manipulation
- `fluent-ffmpeg`, `@ffmpeg-installer/ffmpeg`: Audio/video processing
- `gtts`: Google Text-to-Speech for voice messages
- `gifencoder`: GIF creation

### Utilities
- `cheerio`: HTML parsing for web scraping
- `chalk`, `cfonts`: Terminal styling
- `string-similarity`: Command matching for typo correction

### External APIs
- Wolfram Alpha (configured in `config.json` for math commands)
- Google Translate TTS API (for text-to-speech)
- PopCat API (for lyrics lookup)
- Various image/media APIs accessed via axios