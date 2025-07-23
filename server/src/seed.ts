import db from './db';

interface SnippetSeed {
  title: string;
  language: string;
  content: string;
}

// Delete all existing data before seeding
console.log('Deleting existing data...');
db.exec('DELETE FROM comments'); // Delete comments first due to foreign key
db.exec('DELETE FROM snippets');
console.log('Existing data cleared ✅');

const snippets: SnippetSeed[] = [
  {
    title: 'Hello World (JavaScript)',
    language: 'javascript',
    content: `A basic Hello World example in JavaScript.

\`\`\`javascript
console.log("Hello World");
\`\`\`

This is the simplest way to output text to the console in JavaScript.`,
  },
  {
    title: 'Sum utility (TypeScript)',
    language: 'typescript',
    content: `A utility function to sum two numbers with TypeScript types.

\`\`\`typescript
export const sum = (a: number, b: number) => a + b;
\`\`\`

**Usage:**
\`\`\`typescript
import { sum } from './utils';
console.log(sum(2, 3)); // 5
\`\`\``,
  },
  {
    title: 'React Component with Hooks',
    language: 'typescript',
    content: `A React functional component demonstrating useState and useEffect hooks.

\`\`\`tsx
import React, { useState, useEffect } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
}

const UserProfile: React.FC<{ userId: number }> = ({ userId }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(\`/api/users/\${userId}\`);
        const userData = await response.json();
        setUser(userData);
      } catch (error) {
        console.error('Failed to fetch user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>User not found</div>;

  return (
    <div className="user-profile">
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </div>
  );
};

export default UserProfile;
\`\`\`

This component demonstrates:
- TypeScript interfaces
- useState for state management
- useEffect for side effects
- Async data fetching
- Conditional rendering`,
  },
  {
    title: 'Python Flask API Endpoint',
    language: 'python',
    content: `A simple REST API endpoint using Flask with error handling.

\`\`\`python
from flask import Flask, request, jsonify
from werkzeug.exceptions import BadRequest
import sqlite3
import logging

app = Flask(__name__)
logging.basicConfig(level=logging.INFO)

@app.route('/api/users', methods=['POST'])
def create_user():
    try:
        data = request.get_json()
        
        # Validate required fields
        if not data or 'name' not in data or 'email' not in data:
            raise BadRequest('Name and email are required')
        
        # Connect to database
        conn = sqlite3.connect('users.db')
        cursor = conn.cursor()
        
        # Insert user
        cursor.execute(
            'INSERT INTO users (name, email) VALUES (?, ?)',
            (data['name'], data['email'])
        )
        
        user_id = cursor.lastrowid
        conn.commit()
        conn.close()
        
        logging.info(f'Created user with ID: {user_id}')
        
        return jsonify({
            'id': user_id,
            'name': data['name'],
            'email': data['email']
        }), 201
        
    except BadRequest as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        logging.error(f'Error creating user: {str(e)}')
        return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    app.run(debug=True)
\`\`\`

**Features:**
- Input validation
- Database operations
- Error handling
- Logging
- JSON responses`,
  },
  {
    title: 'CSS Grid Layout System',
    language: 'css',
    content: `A responsive CSS Grid layout system for modern web applications.

\`\`\`css
.container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  grid-gap: 20px;
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.card-header {
  display: flex;
  align-items: center;
  margin-bottom: 15px;
}

.card-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.card-content {
  color: #666;
  line-height: 1.6;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .container {
    grid-template-columns: 1fr;
    padding: 10px;
  }
  
  .card {
    padding: 15px;
  }
}
\`\`\`

This creates a responsive card layout that automatically adjusts to screen size.`,
  },
  {
    title: 'Go HTTP Server with Middleware',
    language: 'go',
    content: `A Go HTTP server with custom middleware for logging and CORS.

\`\`\`go
package main

import (
    "encoding/json"
    "fmt"
    "log"
    "net/http"
    "time"
)

type User struct {
    ID    int    \`json:"id"\`
    Name  string \`json:"name"\`
    Email string \`json:"email"\`
}

// Logging middleware
func loggingMiddleware(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        start := time.Now()
        next.ServeHTTP(w, r)
        log.Printf("%s %s %v", r.Method, r.URL.Path, time.Since(start))
    })
}

// CORS middleware
func corsMiddleware(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        w.Header().Set("Access-Control-Allow-Origin", "*")
        w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE")
        w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
        
        if r.Method == "OPTIONS" {
            w.WriteHeader(http.StatusOK)
            return
        }
        
        next.ServeHTTP(w, r)
    })
}

func getUsersHandler(w http.ResponseWriter, r *http.Request) {
    users := []User{
        {ID: 1, Name: "John Doe", Email: "john@example.com"},
        {ID: 2, Name: "Jane Smith", Email: "jane@example.com"},
    }
    
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(users)
}

func main() {
    mux := http.NewServeMux()
    mux.HandleFunc("/api/users", getUsersHandler)
    
    // Apply middleware
    handler := loggingMiddleware(corsMiddleware(mux))
    
    fmt.Println("Server starting on :8080")
    log.Fatal(http.ListenAndServe(":8080", handler))
}
\`\`\`

**Features:**
- HTTP routing
- Middleware pattern
- JSON responses
- CORS handling
- Request logging`,
  },
  {
    title: 'SQL Database Schema',
    language: 'sql',
    content: `A complete database schema for a blog application with relationships.

\`\`\`sql
-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Categories table
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT
);

-- Posts table
CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
    published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Comments table
CREATE TABLE comments (
    id SERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
    parent_id INTEGER REFERENCES comments(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tags table
CREATE TABLE tags (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    slug VARCHAR(50) UNIQUE NOT NULL
);

-- Post tags junction table
CREATE TABLE post_tags (
    post_id INTEGER REFERENCES posts(id) ON DELETE CASCADE,
    tag_id INTEGER REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (post_id, tag_id)
);

-- Indexes for better performance
CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_category_id ON posts(category_id);
CREATE INDEX idx_comments_post_id ON comments(post_id);
CREATE INDEX idx_posts_published ON posts(published);
\`\`\`

This schema includes:
- User management
- Hierarchical comments
- Many-to-many relationships
- Proper indexing
- Foreign key constraints`,
  },
  {
    title: 'JavaScript Async/Await Patterns',
    language: 'javascript',
    content: `Common async/await patterns for handling asynchronous operations.

\`\`\`javascript
// Parallel execution of multiple async operations
async function fetchUserData(userId) {
  try {
    // Execute multiple requests in parallel
    const [user, posts, comments] = await Promise.all([
      fetch(\`/api/users/\${userId}\`).then(res => res.json()),
      fetch(\`/api/users/\${userId}/posts\`).then(res => res.json()),
      fetch(\`/api/users/\${userId}/comments\`).then(res => res.json())
    ]);

    return {
      user,
      posts,
      comments,
      totalActivity: posts.length + comments.length
    };
  } catch (error) {
    console.error('Error fetching user data:', error);
    throw new Error('Failed to fetch user data');
  }
}

// Sequential execution with error handling
async function processUserSignup(userData) {
  try {
    // Step 1: Validate user data
    const validation = await validateUserData(userData);
    if (!validation.isValid) {
      throw new Error(validation.errors.join(', '));
    }

    // Step 2: Create user account
    const user = await createUser(userData);
    
    // Step 3: Send welcome email
    await sendWelcomeEmail(user.email);
    
    // Step 4: Create default preferences
    await createDefaultPreferences(user.id);

    console.log(\`User \${user.username} created successfully\`);
    return user;
    
  } catch (error) {
    console.error('Signup process failed:', error);
    // Cleanup on failure
    if (error.userCreated) {
      await deleteUser(error.userId);
    }
    throw error;
  }
}

// Rate limiting with retry logic
async function fetchWithRetry(url, options = {}, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(url, options);
      
      if (!response.ok) {
        throw new Error(\`HTTP \${response.status}: \${response.statusText}\`);
      }
      
      return await response.json();
      
    } catch (error) {
      console.log(\`Attempt \${attempt} failed:, error.message\`);
      
      if (attempt === maxRetries) {
        throw new Error(\`Failed after \${maxRetries} attempts: \${error.message}\`);
      }
      
      // Exponential backoff
      const delay = Math.pow(2, attempt) * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}
\`\`\`

**Patterns demonstrated:**
- Parallel async execution
- Sequential error handling
- Retry logic with backoff
- Cleanup on failure`,
  },
  {
    title: 'Docker Multi-stage Build',
    language: 'dockerfile',
    content: `Optimized Dockerfile using multi-stage builds for a Node.js application.

\`\`\`dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (including dev dependencies)
RUN npm ci --only=production=false

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Remove dev dependencies
RUN npm prune --production

# Production stage
FROM node:18-alpine AS production

# Create app user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

WORKDIR /app

# Copy built application from builder stage
COPY --from=builder --chown=nextjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json

# Switch to non-root user
USER nextjs

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \\
  CMD curl -f http://localhost:3000/health || exit 1

# Expose port
EXPOSE 3000

# Start the application
CMD ["node", "dist/index.js"]
\`\`\`

**.dockerignore:**
\`\`\`
node_modules
npm-debug.log
.git
.gitignore
README.md
.env
.nyc_output
coverage
.coverage
dist
\`\`\`

**Benefits:**
- Smaller production image
- Security through non-root user
- Optimized layer caching
- Health checks included`,
  },
  {
    title: 'Rust Error Handling',
    language: 'rust',
    content: `Idiomatic error handling in Rust using Result and custom error types.

\`\`\`rust
use std::fmt;
use std::fs::File;
use std::io::Read;

// Custom error type
#[derive(Debug)]
pub enum ConfigError {
    FileNotFound(String),
    ParseError(String),
    ValidationError(String),
    IoError(std::io::Error),
}

impl fmt::Display for ConfigError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match self {
            ConfigError::FileNotFound(path) => write!(f, "Config file not found: {}", path),
            ConfigError::ParseError(msg) => write!(f, "Failed to parse config: {}", msg),
            ConfigError::ValidationError(msg) => write!(f, "Config validation failed: {}", msg),
            ConfigError::IoError(err) => write!(f, "IO error: {}", err),
        }
    }
}

impl From<std::io::Error> for ConfigError {
    fn from(error: std::io::Error) -> Self {
        ConfigError::IoError(error)
    }
}

#[derive(Debug)]
pub struct Config {
    pub host: String,
    pub port: u16,
    pub database_url: String,
}

impl Config {
    pub fn from_file(path: &str) -> Result<Self, ConfigError> {
        // Check if file exists
        if !std::path::Path::new(path).exists() {
            return Err(ConfigError::FileNotFound(path.to_string()));
        }

        // Read file content
        let mut file = File::open(path)?;
        let mut contents = String::new();
        file.read_to_string(&mut contents)?;

        // Parse configuration
        Self::parse(&contents)
    }

    fn parse(content: &str) -> Result<Self, ConfigError> {
        let mut host = None;
        let mut port = None;
        let mut database_url = None;

        for line in content.lines() {
            let line = line.trim();
            if line.is_empty() || line.starts_with('#') {
                continue;
            }

            let parts: Vec<&str> = line.splitn(2, '=').collect();
            if parts.len() != 2 {
                return Err(ConfigError::ParseError(
                    format!("Invalid line format: {}", line)
                ));
            }

            match parts[0].trim() {
                "host" => host = Some(parts[1].trim().to_string()),
                "port" => {
                    port = Some(parts[1].trim().parse()
                        .map_err(|_| ConfigError::ParseError(
                            "Invalid port number".to_string()
                        ))?);
                }
                "database_url" => database_url = Some(parts[1].trim().to_string()),
                _ => {} // Ignore unknown keys
            }
        }

        // Validate required fields
        let host = host.ok_or_else(|| 
            ConfigError::ValidationError("Missing 'host' field".to_string()))?;
        let port = port.ok_or_else(|| 
            ConfigError::ValidationError("Missing 'port' field".to_string()))?;
        let database_url = database_url.ok_or_else(|| 
            ConfigError::ValidationError("Missing 'database_url' field".to_string()))?;

        Ok(Config {
            host,
            port,
            database_url,
        })
    }
}

// Usage example
fn main() -> Result<(), ConfigError> {
    match Config::from_file("config.txt") {
        Ok(config) => {
            println!("Server will run on {}:{}", config.host, config.port);
            println!("Database: {}", config.database_url);
            Ok(())
        }
        Err(e) => {
            eprintln!("Configuration error: {}", e);
            Err(e)
        }
    }
}
\`\`\`

**Key concepts:**
- Custom error types
- Error conversion with From trait
- Result type for error propagation
- Pattern matching for error handling`,
  },
  {
    title: 'Vue 3 Composition API',
    language: 'typescript',
    content: `Modern Vue 3 component using Composition API with TypeScript.

\`\`\`vue
<template>
  <div class="todo-app">
    <h1>Todo App</h1>
    
    <form @submit.prevent="addTodo" class="todo-form">
      <input
        v-model="newTodo"
        type="text"
        placeholder="Add a new todo..."
        required
      />
      <button type="submit" :disabled="!newTodo.trim()">
        Add Todo
      </button>
    </form>

    <div class="filters">
      <button
        v-for="filter in filters"
        :key="filter"
        @click="currentFilter = filter"
        :class="{ active: currentFilter === filter }"
      >
        {{ filter }}
      </button>
    </div>

    <ul class="todo-list">
      <li
        v-for="todo in filteredTodos"
        :key="todo.id"
        :class="{ completed: todo.completed }"
      >
        <input
          type="checkbox"
          v-model="todo.completed"
          @change="saveTodos"
        />
        <span class="todo-text">{{ todo.text }}</span>
        <button @click="removeTodo(todo.id)" class="delete-btn">
          Delete
        </button>
      </li>
    </ul>

    <p class="stats">
      {{ remainingCount }} of {{ todos.length }} remaining
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'

interface Todo {
  id: number
  text: string
  completed: boolean
}

type FilterType = 'All' | 'Active' | 'Completed'

// Reactive state
const todos = ref<Todo[]>([])
const newTodo = ref('')
const currentFilter = ref<FilterType>('All')

// Constants
const filters: FilterType[] = ['All', 'Active', 'Completed']

// Computed properties
const filteredTodos = computed(() => {
  switch (currentFilter.value) {
    case 'Active':
      return todos.value.filter(todo => !todo.completed)
    case 'Completed':
      return todos.value.filter(todo => todo.completed)
    default:
      return todos.value
  }
})

const remainingCount = computed(() => {
  return todos.value.filter(todo => !todo.completed).length
})

// Methods
const addTodo = () => {
  if (newTodo.value.trim()) {
    todos.value.push({
      id: Date.now(),
      text: newTodo.value.trim(),
      completed: false
    })
    newTodo.value = ''
    saveTodos()
  }
}

const removeTodo = (id: number) => {
  const index = todos.value.findIndex(todo => todo.id === id)
  if (index > -1) {
    todos.value.splice(index, 1)
    saveTodos()
  }
}

const saveTodos = () => {
  localStorage.setItem('todos', JSON.stringify(todos.value))
}

const loadTodos = () => {
  const saved = localStorage.getItem('todos')
  if (saved) {
    todos.value = JSON.parse(saved)
  }
}

// Lifecycle
onMounted(() => {
  loadTodos()
})

// Watchers
watch(currentFilter, (newFilter) => {
  console.log(\`Filter changed to: \${newFilter}\`)
})
</script>

<style scoped>
.todo-app {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.todo-form {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.todo-form input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.filters {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.filters button {
  padding: 8px 16px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
}

.filters button.active {
  background: #007bff;
  color: white;
}

.todo-list {
  list-style: none;
  padding: 0;
}

.todo-list li {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border-bottom: 1px solid #eee;
}

.todo-list li.completed .todo-text {
  text-decoration: line-through;
  color: #666;
}

.todo-text {
  flex: 1;
}

.delete-btn {
  background: #dc3545;
  color: white;
  border: none;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
}
</style>
\`\`\`

**Features demonstrated:**
- Composition API with TypeScript
- Reactive refs and computed properties
- Event handling and form submission
- Local storage persistence
- Scoped styling`,
  },
];

const insert = db.prepare(
  `INSERT INTO snippets (title, language, content, createdAt, updatedAt)
   VALUES (?, ?, ?, ?, ?)`
);

const now = new Date().toISOString();

for (const s of snippets) {
  insert.run(s.title, s.language, s.content, now, now);
}

console.log(`Seeded ${snippets.length} snippets ✅`);
