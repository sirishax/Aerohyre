#include <iostream>
#include <cmath>

const size_t HASH_SIZE = 997;  // Prime number for better distribution

class SparseMatrix {
private:
    // Node structure for linked list
    struct Node {
        int row, col;
        double value;
        Node* next;
        
        Node(int r, int c, double v) : row(r), col(c), value(v), next(nullptr) {}
    };

    static const size_t BUCKET_COUNT = HASH_SIZE;  // Use the external constant
    Node* buckets[BUCKET_COUNT];
    size_t nonZeroElements;

    // Hash function
    size_t hash(int row, int col) const {
        return (static_cast<size_t>(row) * 31 + col) % BUCKET_COUNT;
    }

    // Helper to find node
    Node* findNode(int row, int col) const {
        size_t bucket = hash(row, col);
        Node* current = buckets[bucket];
        
        while (current) {
            if (current->row == row && current->col == col) {
                return current;
            }
            current = current->next;
        }
        return nullptr;
    }

public:
    // Constructor
    SparseMatrix() : nonZeroElements(0) {
        for (size_t i = 0; i < BUCKET_COUNT; ++i) {
            buckets[i] = nullptr;
        }
    }

    // Destructor
    ~SparseMatrix() {
        for (size_t i = 0; i < BUCKET_COUNT; ++i) {
            Node* current = buckets[i];
            while (current) {
                Node* next = current->next;
                delete current;
                current = next;
            }
        }
    }

    // Set value at position
    void set(int row, int col, double value) {
        size_t bucket = hash(row, col);
        Node* node = findNode(row, col);

        if (std::abs(value) < 1e-10) { // Consider as zero
            if (node) {
                // Remove existing non-zero value
                Node* current = buckets[bucket];
                if (current == node) {
                    buckets[bucket] = node->next;
                } else {
                    while (current->next != node) {
                        current = current->next;
                    }
                    current->next = node->next;
                }
                delete node;
                --nonZeroElements;
            }
            return;
        }

        if (node) {
            node->value = value;
        } else {
            Node* newNode = new Node(row, col, value);
            newNode->next = buckets[bucket];
            buckets[bucket] = newNode;
            ++nonZeroElements;
        }
    }

    // Get value at position
    double get(int row, int col) const {
        Node* node = findNode(row, col);
        return node ? node->value : 0.0;
    }

    // Count non-zero elements
    size_t nonZeroCount() const {
        return nonZeroElements;
    }

    // Copy constructor (RAII)
    SparseMatrix(const SparseMatrix& other) : nonZeroElements(0) {
        for (size_t i = 0; i < BUCKET_COUNT; ++i) {
            buckets[i] = nullptr;
            Node* current = other.buckets[i];
            while (current) {
                set(current->row, current->col, current->value);
                current = current->next;
            }
        }
    }

    // Assignment operator (RAII)
    SparseMatrix& operator=(const SparseMatrix& other) {
        if (this != &other) {
            SparseMatrix temp(other);
            std::swap(nonZeroElements, temp.nonZeroElements);
            for (size_t i = 0; i < BUCKET_COUNT; ++i) {
                std::swap(buckets[i], temp.buckets[i]);
            }
        }
        return *this;
    }
};

int main() {
    // Basic Operations Test
    std::cout << "\n=== Basic Operations Test ===\n";
    SparseMatrix matrix;
    
    // Test multiple insertions and edge cases
    matrix.set(0, 0, 1.0);
    matrix.set(1, 2, 3.5);
    matrix.set(2, 1, 2.0);
    matrix.set(100, 100, 7.5);  // Test large indices
    matrix.set(-1, -1, 9.0);    // Test negative indices
    
    std::cout << "Initial matrix values:" << std::endl;
    std::cout << "Value at (0,0): " << matrix.get(0, 0) << std::endl;
    std::cout << "Value at (1,2): " << matrix.get(1, 2) << std::endl;
    std::cout << "Value at (2,1): " << matrix.get(2, 1) << std::endl;
    std::cout << "Value at (100,100): " << matrix.get(100, 100) << std::endl;
    std::cout << "Value at (-1,-1): " << matrix.get(-1, -1) << std::endl;
    std::cout << "Number of non-zero elements: " << matrix.nonZeroCount() << "\n";

    // Hash Collision Test
    std::cout << "\n=== Hash Collision Test ===\n";
    matrix.set(0, HASH_SIZE, 1.5);  // Should hash to same bucket as some other element
    std::cout << "Value at (0," << HASH_SIZE << "): " << matrix.get(0, HASH_SIZE) << std::endl;
    
    // Zero Value Test
    std::cout << "\n=== Zero Value Test ===\n";
    matrix.set(0, 0, 0.0);
    matrix.set(1, 2, 1e-11);  // Should be treated as zero
    std::cout << "Value at (0,0) after setting to 0: " << matrix.get(0, 0) << std::endl;
    std::cout << "Value at (1,2) after setting to 1e-11: " << matrix.get(1, 2) << std::endl;
    std::cout << "Number of non-zero elements: " << matrix.nonZeroCount() << "\n";

    // Deep Copy Test
    std::cout << "\n=== Deep Copy Test ===\n";
    {
        SparseMatrix copy(matrix);
        copy.set(2, 1, 42.0);  // Modify copy
        std::cout << "Original value at (2,1): " << matrix.get(2, 1) << std::endl;
        std::cout << "Modified copy value at (2,1): " << copy.get(2, 1) << std::endl;
    }

    return 0;
}