/**
 * Finds minimum number of meeting rooms required for given events
 * Time Complexity: O(n log n) - due to sorting
 * Space Complexity: O(n) - for storing sorted arrays
 * @param {Array<{start: number, end: number}>} events - Array of event objects
 * @returns {number} Minimum rooms required
 */
function minMeetingRooms(events) {
    if (!events || events.length === 0) return 0;
    
    // Separate start and end times and sort them
    const startTimes = events.map(event => event.start).sort((a, b) => a - b);
    const endTimes = events.map(event => event.end).sort((a, b) => a - b);
    
    let rooms = 0;          // Current rooms in use
    let maxRooms = 0;       // Maximum rooms needed at any point
    let startPtr = 0;       // Pointer for start times
    let endPtr = 0;         // Pointer for end times
    
    // Process all times in chronological order
    while (startPtr < events.length) {
        // If next start time is before next end time, we need a new room
        if (startTimes[startPtr] < endTimes[endPtr]) {
            rooms++;
            startPtr++;
        }
        // If meeting ends, free up a room
        else {
            rooms--;
            endPtr++;
        }
        // Keep track of maximum rooms needed
        maxRooms = Math.max(maxRooms, rooms);
    }
    
    return maxRooms;
}

// For stretch goal: Version that returns room assignments
/**
 * Finds minimum rooms and returns room assignments
 * @param {Array<{start: number, end: number}>} events
 * @returns {{rooms: number, assignments: Array<number>}}
 */
function minMeetingRoomsWithAssignments(events) {
    if (!events || events.length === 0) return { rooms: 0, assignments: [] };
    
    // Add index to track original position
    const indexedEvents = events.map((event, index) => ({...event, index}));
    
    // Sort events by start time
    indexedEvents.sort((a, b) => a.start - b.start);
    
    const assignments = new Array(events.length);
    const activeRooms = new MinHeap();
    let nextRoomId = 0;
    
    for (const event of indexedEvents) {
        // Free up rooms that are done
        while (!activeRooms.isEmpty() && activeRooms.peek().end <= event.start) {

            activeRooms.poll();  // Just remove the completed room
        }
        
        // If no room available, create new room
        if (activeRooms.isEmpty()) {
            activeRooms.add({ end: event.end, roomId: nextRoomId });
            assignments[event.index] = nextRoomId++;
        } else {
            // Try to find a room that's free
            const earliestRoom = activeRooms.poll();
            assignments[event.index] = earliestRoom.roomId;
            activeRooms.add({ end: event.end, roomId: earliestRoom.roomId });
        }
    }
    
    return {
        rooms: nextRoomId,
        assignments: assignments
    };
}

// Simple MinHeap implementation for room management
class MinHeap {
    constructor() {
        this.heap = [];
    }
    
    add(item) {
        this.heap.push(item);
        this._bubbleUp(this.heap.length - 1);
    }
    
    poll() {
        if (this.heap.length === 0) return null;
        const item = this.heap[0];
        const last = this.heap.pop();
        if (this.heap.length > 0) {
            this.heap[0] = last;
            this._bubbleDown(0);
        }
        return item;
    }
    
    peek() {
        return this.heap[0] || null;
    }
    
    isEmpty() {
        return this.heap.length === 0;
    }
    
    _bubbleUp(index) {
        while (index > 0) {
            const parentIndex = Math.floor((index - 1) / 2);
            if (this.heap[parentIndex].end <= this.heap[index].end) break;
            [this.heap[parentIndex], this.heap[index]] = [this.heap[index], this.heap[parentIndex]];
            index = parentIndex;
        }
    }
    
    _bubbleDown(index) {
        while (true) {
            let smallest = index;
            const left = 2 * index + 1;
            const right = 2 * index + 2;
            
            if (left < this.heap.length && this.heap[left].end < this.heap[smallest].end) {
                smallest = left;
            }
            if (right < this.heap.length && this.heap[right].end < this.heap[smallest].end) {
                smallest = right;
            }
            
            if (smallest === index) break;
            
            [this.heap[index], this.heap[smallest]] = [this.heap[smallest], this.heap[index]];
            index = smallest;
        }
    }
}

// Example usage:
const events = [
    { start: 0, end: 30 },
    { start: 5, end: 10 },
    { start: 15, end: 20 }
];

console.log("Minimum rooms needed:", minMeetingRooms(events));
console.log("Room assignments:", minMeetingRoomsWithAssignments(events));