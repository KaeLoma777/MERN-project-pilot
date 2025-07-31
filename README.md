






## 🧠 Registration Flow Summary
- When a user submits their name, email, and password, we:
  1. Check if the email already exists
  2. Hash the password using bcrypt
  3. Save the new user in MongoDB
  4. Generate a JWT token with the user’s ID
  5. Return the token and user info to the frontend

  syntax errors: userController (!Match) to (!isMatch)
  loginUser P in process.env was cap instead of lowercase
  