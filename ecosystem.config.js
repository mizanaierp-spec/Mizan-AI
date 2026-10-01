{
  "name": "Mizan AI",
  "version": "1.0.0",
  "description": "Intelligent Accounting System",
  "apps": [
    {
      "name": "mizan-ai",
      "script": "./backend/server.js",
      "instances": "auto",
      "exec_mode": "cluster",
      "env": {
        "NODE_ENV": "production",
        "PORT": 5000
      },
      "error_file": "./logs/pm2-error.log",
      "out_file": "./logs/pm2-out.log",
      "log_date_format": "YYYY-MM-DD HH:mm:ss Z",
      "max_memory_restart": "1G",
      "watch": false,
      "ignore_watch": [
        "node_modules",
        "logs",
        ".git"
      ]
    }
  ]
}
