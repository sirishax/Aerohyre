
🛠 Room Booking API – PowerShell Examples
This section provides PowerShell command-line examples for interacting with the Room Booking API. Use these commands to test core functionality like booking creation, slot availability, updates, and deletions.

🔧 Prerequisites
Ensure your API server is running locally at http://localhost:3006.

PowerShell 5.1+ (Windows) or PowerShell Core (cross-platform).

JSON body formatting must use double quotes (") for property names and string values.

##✅ Create a New Booking
Creates a booking for a specific room at a given time.

open powershell and go the project directory
Invoke-WebRequest -Uri "http://localhost:3006/api/bookings" `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body '{"roomId":"101","startTime":"2025-05-20T10:00:00","endTime":"2025-05-20T11:00:00"}'
  -Parameters:
    roomId: ID of the room to be booked.

    startTime, endTime: ISO 8601 format timestamps.

    Expected Response:
    201 Created with booking details in the response body.


##📅 Retrieve Available Slots for a Specific Date
  Gets a list of available booking slots for all rooms on a particular date.

  go to powershell and retreive the slots by below command.

  Invoke-WebRequest -Uri "http://localhost:3006/api/slots?date=2025-05-20"
  Query Parameter:

  date: A date string in YYYY-MM-DD format.

  Expected Response:
  200 OK with a JSON array of available time slots.

##🔄 Update an Existing Booking
  Modifies the time range of an existing booking using its booking ID.
  
  powershell

  Invoke-WebRequest -Uri "http://localhost:3006/api/bookings/1" `
    -Method PUT `
    -Headers @{"Content-Type"="application/json"} `
    -Body '{"startTime":"2025-05-20T12:00:00","endTime":"2025-05-20T13:00:00"}'
  Path Parameter:
  
  1: ID of the booking to update.
  
  Expected Response:
  200 OK with updated booking details.

##❌ Delete a Booking
  Removes a booking by its ID.
  
  powershell
  Copy
  Edit
  Invoke-WebRequest -Uri "http://localhost:3006/api/bookings/1" -Method DELETE
  Expected Response:
  204 No Content indicating successful deletion.
  
  🔍 Tips
  Time Format: Always use YYYY-MM-DDTHH:MM:SS for timestamps.
  
  Error Handling: Use try { ... } catch { $_.Exception.Message } to handle API errors in PowerShell.
  
  Custom Headers: Add authorization tokens in the headers if your API requires auth (e.g., Authorization: Bearer <token>).


##In cmd.txt file we have the commands you can edit and book slots as you require.
