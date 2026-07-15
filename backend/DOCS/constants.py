# Constants and Configuration for the Quote of the Day Backend

# Database Configuration
DATABASE_NAME = "database.db"

# Table Names
TABLE_QUOTES = "quotes"
TABLE_FAVORITES = "favorites"

# Server Configuration
SERVER_HOST = "0.0.0.0"
SERVER_PORT = 8000

# API Response Messages
MSG_SUCCESS_ADD_FAVORITE = "Quote added to favorites successfully!"
MSG_ERROR_QUOTE_NOT_FOUND = "Quote ID not found in database."
MSG_ERROR_ALREADY_FAVORITE = "Quote is already in your favorites."
MSG_ERROR_GENERIC = "An unexpected error occurred."
