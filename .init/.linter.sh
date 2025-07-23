#!/bin/bash
cd /home/kavia/workspace/code-generation/typing-practice-pro-8809994e/react_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

