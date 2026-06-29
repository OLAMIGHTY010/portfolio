#!/bin/bash
set -e

echo "=== 1. Creating directories ==="
mkdir -p frontend_public
mkdir -p frontend_admin
mkdir -p backend/src/routes

echo "=== 2. Copying files to frontend_public ==="
cp -R src frontend_public/
cp -R public frontend_public/
cp package.json tsconfig.json next.config.ts postcss.config.mjs eslint.config.mjs components.json .gitignore .env.local frontend_public/

echo "=== 3. Copying files to frontend_admin ==="
cp -R src frontend_admin/
cp -R public frontend_admin/
cp package.json tsconfig.json next.config.ts postcss.config.mjs eslint.config.mjs components.json .gitignore .env.local frontend_admin/

echo "=== 4. Cleaning up frontend_public ==="
rm -rf frontend_public/src/app/admin
rm -rf frontend_public/src/app/login

echo "=== 5. Cleaning up frontend_admin ==="
rm -rf frontend_admin/src/app/about
rm -rf frontend_admin/src/app/blog
rm -rf frontend_admin/src/app/certifications
rm -rf frontend_admin/src/app/contact
rm -rf frontend_admin/src/app/experience
rm -rf frontend_admin/src/app/skills
rm -rf frontend_admin/src/app/flowmart
rm -rf frontend_admin/src/app/projects

# Replace main page.tsx for admin to redirect to /admin
cat << 'EOF' > frontend_admin/src/app/page.tsx
import { redirect } from "next/navigation";

export default function RootPage() {
  redirect("/admin");
}
EOF

echo "=== 6. Adjusting frontend_admin port ==="
# In package.json, replace "next dev" with "next dev -p 3001"
sed -i 's/"dev": "next dev"/"dev": "next dev -p 3001"/g' frontend_admin/package.json

echo "=== Reorganization completed successfully! ==="
