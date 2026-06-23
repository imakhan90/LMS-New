import { Course, Question, Quiz, Module, Lesson } from '../types';

// Helper to generate 10 academic MCQs for a specific course module
export function generateWeeklyQuiz(courseCode: string, moduleNum: number, moduleId: string): Quiz {
  const quizTitle = `${courseCode} Module ${moduleNum} Graded Evaluation`;
  const questions: Question[] = [];

  // Compact database of academic questions to keep token count low but quality high
  const getQuestionPool = (): { text: string; options: string[]; correctOptionIndex: number }[] => {
    if (courseCode === 'CS101') {
      switch (moduleNum) {
        case 1:
          return [
            { text: "Who designed the Analytical Engine, considered the first mechanical computer?", options: ["Alan Turing", "Charles Babbage", "Ada Lovelace", "John von Neumann"], correctOptionIndex: 1 },
            { text: "Which component inside the CPU coordinates activities and fetches instructions?", options: ["Arithmetic Logic Unit", "Control Unit", "Program Counter", "L1 Cache"], correctOptionIndex: 1 },
            { text: "What architectural model stores program instructions and data in the same memory?", options: ["Harvard", "von Neumann", "RISC", "CISC"], correctOptionIndex: 1 },
            { text: "Which type of computer is primarily used for weather forecasting and scientific modeling?", options: ["Mainframe", "Supercomputer", "Microcomputer", "Workstation"], correctOptionIndex: 1 },
            { text: "Which of the following is strictly categorized as system software?", options: ["Web Browser", "Operating System", "Word Processor", "Database Client"], correctOptionIndex: 1 },
            { text: "What was the primary active electronic component of first-generation computers?", options: ["Transistors", "Vacuum Tubes", "Integrated Circuits", "Microprocessors"], correctOptionIndex: 1 },
            { text: "Which computer hardware component acts as the main bus circuit board?", options: ["Motherboard", "Sound Card", "GPU", "Network Card"], correctOptionIndex: 0 },
            { text: "What CPU registry stores the memory address of the next instruction to execute?", options: ["Instruction Register", "Program Counter", "Accumulator", "Memory Address Register"], correctOptionIndex: 1 },
            { text: "Which memory tier built inside the CPU is the absolute fastest?", options: ["L1 Cache", "Registers", "RAM", "ROM"], correctOptionIndex: 1 },
            { text: "Which device is strictly classified as an input device?", options: ["Monitor", "Keyboard", "Printer", "Speaker"], correctOptionIndex: 1 }
          ];
        case 2:
          return [
            { text: "What unit of CPU speed represents one billion instruction cycles per second?", options: ["Megahertz", "Gigahertz", "Kilohertz", "Terahertz"], correctOptionIndex: 1 },
            { text: "Which memory type contains the fundamental boot firmware of the system?", options: ["RAM", "ROM", "SSD", "Flash"], correctOptionIndex: 1 },
            { text: "Which non-volatile storage has no moving physical parts?", options: ["HDD", "SSD", "CD-ROM", "Floppy Disk"], correctOptionIndex: 1 },
            { text: "What level of CPU cache is typically shared across all processing cores?", options: ["L1 Cache", "L2 Cache", "L3 Cache", "L4 Cache"], correctOptionIndex: 2 },
            { text: "Which bus transfers memory addresses from the CPU to external memory?", options: ["Data Bus", "Address Bus", "Control Bus", "Peripheral Bus"], correctOptionIndex: 1 },
            { text: "What happens to dynamic RAM (DRAM) if power is removed?", options: ["Retains data", "Loses data (Volatile)", "Locks state", "Backs up to ROM"], correctOptionIndex: 1 },
            { text: "Which storage medium is most optimal for long-term cold archives?", options: ["Magnetic Tape", "SSD", "RAM", "CD-R"], correctOptionIndex: 0 },
            { text: "What is the primary role of the ALU?", options: ["I/O Scheduling", "Arithmetic and Logic operations", "Instruction Decoding", "Clock Timing"], correctOptionIndex: 1 },
            { text: "Which connection standard handles serial communication for modern peripherals?", options: ["SATA", "USB", "PCI Express", "IDE"], correctOptionIndex: 1 },
            { text: "What memory architecture is faster than dynamic RAM and used for cache?", options: ["SRAM", "DRAM", "ROM", "EPROM"], correctOptionIndex: 0 }
          ];
        case 3:
          return [
            { text: "What core module of an OS remains in RAM and directly manages hardware?", options: ["Shell", "Kernel", "Compiler", "Driver"], correctOptionIndex: 1 },
            { text: "What system maps user directories to physical sectors on a drive?", options: ["File System", "Process Manager", "Memory Swapper", "Scheduler"], correctOptionIndex: 0 },
            { text: "Which OS is characterized by a monolithic, open-source Linux kernel?", options: ["Windows", "Ubuntu Linux", "macOS", "MS-DOS"], correctOptionIndex: 1 },
            { text: "What is Virtual Memory?", options: ["Cloud memory", "Using storage space to extend physical RAM", "Hypervisor RAM", "Graphics Card memory"], correctOptionIndex: 1 },
            { text: "Which process scheduling state indicates a process is waiting for disk I/O?", options: ["Running", "Ready", "Blocked / Waiting", "Terminated"], correctOptionIndex: 2 },
            { text: "In Linux, which command is used to display current directory contents?", options: ["cd", "ls", "mkdir", "pwd"], correctOptionIndex: 1 },
            { text: "What is an absolute path?", options: ["Path from current folder", "Path starting from the root directory", "Relative web link", "System symbolic link"], correctOptionIndex: 1 },
            { text: "What mechanism stops processes from writing to each other's memory space?", options: ["Thread mapping", "Memory Protection / Sandboxing", "Symmetric Multiprocessing", "Paging"], correctOptionIndex: 1 },
            { text: "What is a lightweight process that shares address space with its parent?", options: ["Task", "Thread", "Daemon", "Service"], correctOptionIndex: 1 },
            { text: "What is the standard journaling file system for modern Windows?", options: ["FAT32", "NTFS", "ext4", "APFS"], correctOptionIndex: 1 }
          ];
        case 4:
          return [
            { text: "What is a valid integer variable declaration in Python?", options: ["x = 5", "int x = 5", "declare x = 5", "x := int"], correctOptionIndex: 0 },
            { text: "What is the output of print(9 // 2) in Python?", options: ["4.5", "4", "5", "1"], correctOptionIndex: 1 },
            { text: "Which operator represents exponentiation in Python?", options: ["^", "**", "pow", "exp"], correctOptionIndex: 1 },
            { text: "What type represents a binary logical value (True/False)?", options: ["string", "integer", "boolean", "float"], correctOptionIndex: 2 },
            { text: "Which Python function captures user terminal entries?", options: ["read()", "input()", "get()", "scan()"], correctOptionIndex: 1 },
            { text: "What will print(type('Hello')) output?", options: ["<class 'int'>", "<class 'str'>", "<class 'char'>", "<class 'type'>"], correctOptionIndex: 1 },
            { text: "What is the modulo operator in Python?", options: ["/", "//", "%", "div"], correctOptionIndex: 2 },
            { text: "Which of the following is an invalid variable name in Python?", options: ["total_sum", "2_total", "_total", "total2"], correctOptionIndex: 1 },
            { text: "How do you cast '123' to an integer in Python?", options: ["int('123')", "cast('123')", "integer('123')", "(int)'123'"], correctOptionIndex: 0 },
            { text: "What does the assignment operator look like in Python?", options: ["==", "=", ":=", "<-"], correctOptionIndex: 1 }
          ];
        case 5:
          return [
            { text: "Which keyword introduces a conditional block in Python?", options: ["case", "if", "check", "then"], correctOptionIndex: 1 },
            { text: "What is the standard indent size for Python code blocks?", options: ["2 spaces", "4 spaces", "8 spaces", "Tab only"], correctOptionIndex: 1 },
            { text: "Which loop type is preferred when the number of iterations is known?", options: ["while", "for", "do-while", "until"], correctOptionIndex: 1 },
            { text: "What symbol denotes equality testing in Python?", options: ["=", "==", "===", "equals"], correctOptionIndex: 1 },
            { text: "What is the Python alternative keyword for 'else if'?", options: ["elseif", "elif", "elsif", "other"], correctOptionIndex: 1 },
            { text: "What numbers are generated by range(1, 4)?", options: ["1, 2, 3, 4", "1, 2, 3", "0, 1, 2, 3", "1, 3"], correctOptionIndex: 1 },
            { text: "Which statement immediately exits the closest enclosing loop?", options: ["continue", "break", "pass", "exit"], correctOptionIndex: 1 },
            { text: "Which operator represents logical unequal state?", options: ["<>", "!=", "not", "!=="], correctOptionIndex: 1 },
            { text: "Which loop runs as long as its condition evaluates to True?", options: ["for", "while", "until", "repeat"], correctOptionIndex: 1 },
            { text: "What statement skips the current iteration and jumps to the next iteration?", options: ["break", "continue", "pass", "next"], correctOptionIndex: 1 }
          ];
        case 6:
          return [
            { text: "Which keyword defines a custom function in Python?", options: ["function", "def", "func", "procedure"], correctOptionIndex: 1 },
            { text: "What values are specified inside function headers to receive inputs?", options: ["Arguments", "Parameters", "Variables", "References"], correctOptionIndex: 1 },
            { text: "What keyword returns a computed value from a function?", options: ["break", "return", "output", "exit"], correctOptionIndex: 1 },
            { text: "What is variable scope?", options: ["Memory size", "Region of code where a variable is accessible", "Execution time", "Data type boundary"], correctOptionIndex: 1 },
            { text: "What is the default return value of a Python function with no return?", options: ["0", "False", "None", "Null"], correctOptionIndex: 2 },
            { text: "How do you call a function named calculate_sum?", options: ["calculate_sum()", "call calculate_sum", "run calculate_sum", "calculate_sum.start()"], correctOptionIndex: 0 },
            { text: "Which variables can be accessed anywhere in the script?", options: ["Local", "Global", "Static", "Enclosed"], correctOptionIndex: 1 },
            { text: "What is a recursive function?", options: ["A function with many loops", "A function that calls itself", "An anonymous function", "A high-performance system function"], correctOptionIndex: 1 },
            { text: "What parameters are assigned values if none are provided during call?", options: ["Dynamic parameters", "Default parameters", "Global variables", "Positional arguments"], correctOptionIndex: 1 },
            { text: "Which namespace contains Python's built-in print and len functions?", options: ["Local", "Global", "Built-in", "Enclosed"], correctOptionIndex: 2 }
          ];
        case 7:
          return [
            { text: "What is an array?", options: ["A non-linear grid", "A contiguous collection of elements of same type", "A chain of linked nodes", "A dynamic key-value dictionary"], correctOptionIndex: 1 },
            { text: "What is the access complexity of an array element given its index?", options: ["O(N)", "O(log N)", "O(1)", "O(N log N)"], correctOptionIndex: 2 },
            { text: "Which data structure operates on a Last-In, First-Out (LIFO) order?", options: ["Queue", "Stack", "Binary Tree", "Linked List"], correctOptionIndex: 1 },
            { text: "What operation inserts an item onto a LIFO Stack?", options: ["Enqueue", "Push", "Pop", "Shift"], correctOptionIndex: 1 },
            { text: "What data structure operates on a First-In, First-Out (FIFO) basis?", options: ["Stack", "Queue", "Heap", "Hash Map"], correctOptionIndex: 1 },
            { text: "What operation adds an item to the end of a FIFO Queue?", options: ["Dequeue", "Enqueue", "Push", "Peek"], correctOptionIndex: 1 },
            { text: "What is the main drawback of a standard static array?", options: ["Slow lookup", "Fixed size", "Dynamic reallocation overhead", "Memory leak risk"], correctOptionIndex: 1 },
            { text: "What does Peek do on a stack?", options: ["Removes top item", "Looks at top item without removing it", "Empties the stack", "Searches for an item"], correctOptionIndex: 1 },
            { text: "What index corresponds to the first element in standard arrays?", options: ["1", "0", "-1", "First"], correctOptionIndex: 1 },
            { text: "Which structure connects elements using individual nodes with data and pointers?", options: ["Array", "Linked List", "Stack", "Queue"], correctOptionIndex: 1 }
          ];
        case 8:
          return [
            { text: "What phase of software lifecycle outlines system architectures?", options: ["Requirements gathering", "System Design", "Coding", "Testing"], correctOptionIndex: 1 },
            { text: "What is a Student Management System?", options: ["Hardware diagnostic tool", "LMS application to organize student databases", "Network security firewall", "Search engine indexing bot"], correctOptionIndex: 1 },
            { text: "Which testing methodology validates individual functions?", options: ["System Testing", "Unit Testing", "Integration Testing", "UAT"], correctOptionIndex: 1 },
            { text: "What is the main output of the Software Requirement phase?", options: ["UML Diagram", "SRS Document", "Source Code", "Test Plan"], correctOptionIndex: 1 },
            { text: "What is the standard system architecture where presentation, logic, and data are separated?", options: ["Monolithic", "Three-Tier / MVC", "SaaS", "Microservices"], correctOptionIndex: 1 },
            { text: "Which logic structure checks multiple conditions sequentially?", options: ["If-Else Chain", "Switch", "While loop", "Recursion"], correctOptionIndex: 0 },
            { text: "How do you permanently store student record files on disk?", options: ["File Persistence", "Session Storage", "RAM Registers", "Cache memory"], correctOptionIndex: 0 },
            { text: "What does dry-running code mean?", options: ["Compiling", "Tracing execution line-by-line on paper", "Debugging on a live server", "Automated unit tests"], correctOptionIndex: 1 },
            { text: "What represents a blueprint for creating objects in OOP?", options: ["Instance", "Class", "Function", "Module"], correctOptionIndex: 1 },
            { text: "What is the final phase of the SDLC?", options: ["System Testing", "Maintenance and Support", "Deployment", "Documentation"], correctOptionIndex: 1 }
          ];
      }
    } else if (courseCode === 'CS201') {
      switch (moduleNum) {
        case 1:
          return [
            { text: "What does Big O notation describe?", options: ["Exact program execution time", "Worst-case upper bound of runtime complexity", "Best-case execution metrics", "Memory byte limits"], correctOptionIndex: 1 },
            { text: "What is the worst-case runtime of Binary Search?", options: ["O(1)", "O(log N)", "O(N)", "O(N log N)"], correctOptionIndex: 1 },
            { text: "What is the worst-case runtime of Bubble Sort on unsorted data?", options: ["O(log N)", "O(N)", "O(N log N)", "O(N^2)"], correctOptionIndex: 3 },
            { text: "What defines space complexity?", options: ["How much disk space is used", "Amount of memory an algorithm needs relative to input size", "Screen layout coordinates", "Memory allocation speeds"], correctOptionIndex: 1 },
            { text: "If an algorithm runs in constant time, its Big O notation is:", options: ["O(N)", "O(1)", "O(log N)", "O(2^N)"], correctOptionIndex: 1 },
            { text: "Which complexity class represents the slowest growing function?", options: ["O(N)", "O(log N)", "O(N^2)", "O(2^N)"], correctOptionIndex: 1 },
            { text: "What is the complexity of accessing an array element by index?", options: ["O(log N)", "O(1)", "O(N)", "O(N^2)"], correctOptionIndex: 1 },
            { text: "What does a time complexity of O(N!) represent?", options: ["Logarithmic", "Linear", "Polynomial", "Factorial"], correctOptionIndex: 3 },
            { text: "What is the average time complexity of Quick Sort?", options: ["O(N)", "O(N log N)", "O(N^2)", "O(log N)"], correctOptionIndex: 1 },
            { text: "Which notation is used to represent the tight mathematical bound?", options: ["Big O", "Big Theta", "Big Omega", "Little o"], correctOptionIndex: 1 }
          ];
        case 2:
          return [
            { text: "What represents a list where each element references the next?", options: ["Singly Linked List", "Doubly Linked List", "Static Array", "Queue"], correctOptionIndex: 0 },
            { text: "What is the insertion complexity at the head of a Singly Linked List?", options: ["O(N)", "O(1)", "O(log N)", "O(N log N)"], correctOptionIndex: 1 },
            { text: "What does a Doubly Linked List node contain besides data?", options: ["Next pointer", "Previous pointer", "Next and Previous pointers", "Parent pointer"], correctOptionIndex: 2 },
            { text: "What is the time complexity of searching for an arbitrary value in a Linked List?", options: ["O(1)", "O(log N)", "O(N)", "O(N log N)"], correctOptionIndex: 2 },
            { text: "What represents an array that automatically doubles its size when full?", options: ["Static Array", "Dynamic Array", "Linked List", "Hash Map"], correctOptionIndex: 1 },
            { text: "In a dynamic array, what is the amortized insertion complexity at the end?", options: ["O(1)", "O(N)", "O(log N)", "O(N^2)"], correctOptionIndex: 0 },
            { text: "Which structure does not require contiguous memory blocks?", options: ["Array", "Linked List", "Matrix", "Vector"], correctOptionIndex: 1 },
            { text: "What pointer points to the first node of a Linked List?", options: ["Tail", "Head", "Root", "Parent"], correctOptionIndex: 1 },
            { text: "What is the tail pointer node's next property in a Singly Linked List?", options: ["Head", "Null / None", "Self", "First node"], correctOptionIndex: 1 },
            { text: "What list wraps the tail node back to point to the head node?", options: ["Singly Linked List", "Doubly Linked List", "Circular Linked List", "Sorted Linked List"], correctOptionIndex: 2 }
          ];
        case 3:
          return [
            { text: "Which principle governs stack operations?", options: ["FIFO", "LIFO", "LILO", "Random"], correctOptionIndex: 1 },
            { text: "Which principle governs queue operations?", options: ["FIFO", "LIFO", "FILO", "Symmetric"], correctOptionIndex: 0 },
            { text: "What operation removes the top item from a Stack?", options: ["Push", "Pop", "Peek", "Shift"], correctOptionIndex: 1 },
            { text: "What operation removes the front item from a Queue?", options: ["Enqueue", "Dequeue", "Push", "Peek"], correctOptionIndex: 1 },
            { text: "Where does insertion occur in a Queue?", options: ["Front", "Rear / Tail", "Middle", "Random index"], correctOptionIndex: 1 },
            { text: "What is the time complexity of Stack push/pop operations?", options: ["O(N)", "O(1)", "O(log N)", "O(N log N)"], correctOptionIndex: 1 },
            { text: "What is stack overflow?", options: ["An online forum", "Attempting to push onto a full stack", "Popping from an empty stack", "Memory reallocation speed"], correctOptionIndex: 1 },
            { text: "What is stack underflow?", options: ["Running out of RAM", "Popping from an empty stack", "Stack resizing", "Data corruption"], correctOptionIndex: 1 },
            { text: "Which data structure is used to implement recursion behind the scenes?", options: ["Queue", "Stack", "Binary Tree", "Hash Table"], correctOptionIndex: 1 },
            { text: "Which data structure is ideal for scheduling print jobs?", options: ["Stack", "Queue", "Tree", "Graph"], correctOptionIndex: 1 }
          ];
        case 4:
          return [
            { text: "What is a tree node with no children called?", options: ["Root", "Branch", "Leaf", "Parent"], correctOptionIndex: 2 },
            { text: "In a Binary Search Tree, where are values smaller than the root stored?", options: ["Left Subtree", "Right Subtree", "Root node", "Leaf nodes only"], correctOptionIndex: 0 },
            { text: "What is the maximum number of children a binary tree node can have?", options: ["1", "2", "3", "Unlimited"], correctOptionIndex: 1 },
            { text: "What is a self-balancing Binary Search Tree called?", options: ["Binary Heap", "AVL Tree", "Trie", "Splay Tree"], correctOptionIndex: 1 },
            { text: "Which traversal visits nodes in the order: Left, Root, Right?", options: ["Pre-order", "In-order", "Post-order", "Level-order"], correctOptionIndex: 1 },
            { text: "Which traversal visits nodes in the order: Root, Left, Right?", options: ["Pre-order", "In-order", "Post-order", "Level-order"], correctOptionIndex: 0 },
            { text: "Which traversal visits nodes in the order: Left, Right, Root?", options: ["Pre-order", "In-order", "Post-order", "Level-order"], correctOptionIndex: 2 },
            { text: "What is the lookup complexity in a balanced BST?", options: ["O(N)", "O(log N)", "O(1)", "O(N log N)"], correctOptionIndex: 1 },
            { text: "What is the worst-case lookup complexity in an unbalanced skewed BST?", options: ["O(1)", "O(log N)", "O(N)", "O(N^2)"], correctOptionIndex: 2 },
            { text: "What is the balance factor of a node in an AVL tree?", options: ["Height diff <= 1", "Height diff <= 2", "Value diff <= 1", "Left nodes count"], correctOptionIndex: 0 }
          ];
        case 5:
          return [
            { text: "What represents a graph where edges have directions?", options: ["Undirected Graph", "Directed Graph (Digraph)", "Binary Tree", "Cycle Graph"], correctOptionIndex: 1 },
            { text: "Which algorithm uses a FIFO Queue to traverse a graph level-by-level?", options: ["DFS", "BFS", "Dijkstra", "Kruskal"], correctOptionIndex: 1 },
            { text: "Which algorithm uses a Stack/recursion to traverse deep along graph branches?", options: ["BFS", "DFS", "Prim", "Bellman-Ford"], correctOptionIndex: 1 },
            { text: "What represents a matrix showing connections between nodes in a graph?", options: ["Adjacency Matrix", "Incidence List", "Sparse Vector", "Binary Array"], correctOptionIndex: 0 },
            { text: "Which algorithm is used to find shortest paths in a weighted graph?", options: ["DFS", "Dijkstra's Algorithm", "Prim's Algorithm", "Kruskal's Algorithm"], correctOptionIndex: 1 },
            { text: "What is a graph with no cycles called?", options: ["Cyclic", "Acyclic", "Dense", "Complete"], correctOptionIndex: 1 },
            { text: "What represent individual connection points in a graph?", options: ["Edges", "Vertices (Nodes)", "Paths", "Weights"], correctOptionIndex: 1 },
            { text: "What represents the connection lines between vertices?", options: ["Edges", "Degrees", "Weights", "Pointers"], correctOptionIndex: 0 },
            { text: "Which representation is more space-efficient for sparse graphs?", options: ["Adjacency Matrix", "Adjacency List", "2D Array", "Complete Graph Matrix"], correctOptionIndex: 1 },
            { text: "What represents the number of edges connected to a vertex?", options: ["Weight", "Degree", "Path", "Cycle"], correctOptionIndex: 1 }
          ];
        case 6:
          return [
            { text: "Which sorting algorithm repeatedly swaps adjacent elements?", options: ["Quick Sort", "Bubble Sort", "Merge Sort", "Insertion Sort"], correctOptionIndex: 1 },
            { text: "Which algorithm uses the divide-and-conquer paradigm and has guaranteed O(N log N) worst-case?", options: ["Quick Sort", "Merge Sort", "Selection Sort", "Bubble Sort"], correctOptionIndex: 1 },
            { text: "What sorting algorithm is considered highly adaptive and efficient for nearly sorted lists?", options: ["Selection Sort", "Insertion Sort", "Merge Sort", "Quick Sort"], correctOptionIndex: 1 },
            { text: "Which algorithm selects the minimum element and puts it at the beginning?", options: ["Bubble Sort", "Selection Sort", "Insertion Sort", "Quick Sort"], correctOptionIndex: 1 },
            { text: "What is the pivot element used for in Quick Sort?", options: ["Finding array bounds", "Partitioning the array", "Recursive termination", "Array swapping"], correctOptionIndex: 1 },
            { text: "What is a stable sorting algorithm?", options: ["It uses no extra RAM", "It preserves relative order of duplicate keys", "Its runtime is constant", "It never crashes"], correctOptionIndex: 1 },
            { text: "Which sorting algorithm is in-place but has an O(N^2) worst case if pivot is chosen poorly?", options: ["Merge Sort", "Quick Sort", "Radix Sort", "Heap Sort"], correctOptionIndex: 1 },
            { text: "What is the worst-case space complexity of Merge Sort?", options: ["O(1)", "O(log N)", "O(N)", "O(N^2)"], correctOptionIndex: 2 },
            { text: "Which sorting algorithm operates on integers by grouping individual digits?", options: ["Insertion Sort", "Radix Sort", "Quick Sort", "Merge Sort"], correctOptionIndex: 1 },
            { text: "What is the runtime of Bubble Sort on fully sorted input?", options: ["O(N^2)", "O(N log N)", "O(N)", "O(1)"], correctOptionIndex: 2 }
          ];
        case 7:
          return [
            { text: "What is the complexity of Linear Search on an unsorted array?", options: ["O(1)", "O(log N)", "O(N)", "O(N log N)"], correctOptionIndex: 2 },
            { text: "What prerequisite is mandatory before running Binary Search?", options: ["No duplicates", "Fully sorted array", "Contiguous RAM blocks", "Integer values only"], correctOptionIndex: 1 },
            { text: "What is the time complexity of Binary Search?", options: ["O(N)", "O(log N)", "O(1)", "O(N log N)"], correctOptionIndex: 1 },
            { text: "If index low=0 and high=10, what is mid calculation in binary search?", options: ["4", "5", "6", "10"], correctOptionIndex: 1 },
            { text: "Which search algorithm checks every element sequentially?", options: ["Binary Search", "Linear Search", "Hashing Lookup", "DFS"], correctOptionIndex: 1 },
            { text: "How does binary search prune the search space in each step?", options: ["Subtracts 1", "Divides search space in half", "Multiplies scope", "Filters negative values"], correctOptionIndex: 1 },
            { text: "What does binary search return if the element is not found?", options: ["Index of close element", "-1 or Null", "First element", "Infinity"], correctOptionIndex: 1 },
            { text: "Which searching approach provides O(1) average lookup speed?", options: ["Binary Search", "Hash Table lookup", "Linear Search", "Binary Search Tree"], correctOptionIndex: 1 },
            { text: "In interpolation search, what is key calculation based on?", options: ["Midpoint only", "Uniform distribution estimation formulas", "Graph traverses", "Random index picks"], correctOptionIndex: 1 },
            { text: "Which searching algorithm is ideal for short, completely unsorted lists?", options: ["Binary Search", "Linear Search", "Trie lookup", "Dijkstra"], correctOptionIndex: 1 }
          ];
        case 8:
          return [
            { text: "What represents a complete Library Management System's index structure?", options: ["Hash Map/BST", "Simple Stack", "Linear Queue", "File Array only"], correctOptionIndex: 0 },
            { text: "Which structure allows O(1) average search of book details by ISBN?", options: ["Binary Search Tree", "Hash Table", "Doubly Linked List", "Singly Linked List"], correctOptionIndex: 1 },
            { text: "What represents a tree where node elements represent catalog categories?", options: ["Linear queue", "Hierarchical Tree", "Cyclic Graph", "LIFO Stack"], correctOptionIndex: 1 },
            { text: "Why is a Linked List preferred over a fixed array for checkout histories?", options: ["Faster index access", "Dynamic resizing with O(1) append", "No memory allocation", "Automatic sorting"], correctOptionIndex: 1 },
            { text: "In a Library Database, what is the role of a primary index key?", options: ["Hashing lookup anchor", "File sorting", "Symmetric encryption", "Buffer storage"], correctOptionIndex: 0 },
            { text: "What represents collision resolution in ISBN Hash structures?", options: ["Chain linking with LinkedList", "Pivoting", "Dividing and conquering", "Dynamic sorting"], correctOptionIndex: 0 },
            { text: "Which structure manages waitlists for popular checkout books?", options: ["Stack", "FIFO Queue", "Tree", "Graph"], correctOptionIndex: 1 },
            { text: "What data structure is used to implement deep undo/redo of catalog changes?", options: ["Stack", "Queue", "Matrix", "Graph"], correctOptionIndex: 0 },
            { text: "What is memory leakage in systems?", options: ["High CPU load", "Unreleased heap memory references", "RAM clock sync delays", "Sectors disk read failures"], correctOptionIndex: 1 },
            { text: "What represents the space complexity of an index containing N ISBN records?", options: ["O(1)", "O(N)", "O(log N)", "O(N^2)"], correctOptionIndex: 1 }
          ];
      }
    } else if (courseCode === 'CS301') {
      switch (moduleNum) {
        case 1:
          return [
            { text: "What does the abbreviation SDLC stand for?", options: ["Software Development Lifecycle", "System Diagnostic Log Center", "Secure Design Logic Code", "Shared Database Link Connection"], correctOptionIndex: 0 },
            { text: "Which software development model operates in rigid linear phases?", options: ["Agile", "Waterfall", "Scrum", "DevOps"], correctOptionIndex: 1 },
            { text: "What Agile framework is based on short iterative sprints?", options: ["Waterfall", "Scrum", "V-Model", "Spiral"], correctOptionIndex: 1 },
            { text: "What is a primary principle of the Agile Manifesto?", options: ["Rigid process following", "Comprehensive documentation over code", "Customer collaboration over contract negotiation", "Strict contract plans"], correctOptionIndex: 2 },
            { text: "What is a sprint in Scrum?", options: ["A running race", "A fixed-duration cycle of 1 to 4 weeks to build increment", "A daily standup meeting", "A database optimization run"], correctOptionIndex: 1 },
            { text: "Who protects the Scrum team from external distractions?", options: ["Product Owner", "Scrum Master", "Lead Architect", "CEO"], correctOptionIndex: 1 },
            { text: "Which SDLC phase identifies what the user actually wants to solve?", options: ["Coding", "System Design", "Requirements Analysis", "Testing"], correctOptionIndex: 2 },
            { text: "What represents a daily sync ritual in Scrum?", options: ["Sprint Review", "Daily Standup", "Sprint Retro", "Backlog Grooming"], correctOptionIndex: 1 },
            { text: "What is the product backlog?", options: ["Code archive", "Prioritized list of required features/tasks", "Server error log", "Customer review cards"], correctOptionIndex: 1 },
            { text: "Which SDLC model is iterative, prioritizing risk assessment?", options: ["Waterfall", "Spiral", "V-Model", "Linear Sequence"], correctOptionIndex: 1 }
          ];
        case 2:
          return [
            { text: "What are Functional Requirements?", options: ["System page load speeds", "Core actions/features the system must perform", "Security encryption metrics", "Platform compatibility limits"], correctOptionIndex: 1 },
            { text: "What represents a Non-functional Requirement?", options: ["Add student record", "Secure HTTPS login with under 2-second latency", "Generate PDF grade sheets", "Launch quiz modal"], correctOptionIndex: 1 },
            { text: "What is a standard template for writing User Stories?", options: ["As a... I want... So that...", "If... Then... Else...", "Class... Method... Parameters...", "Input... Process... Output..."], correctOptionIndex: 0 },
            { text: "What is SRS in Software Engineering?", options: ["Software Requirement Specification", "Secure Registry Server", "System Refactoring Strategy", "Scrum Report System"], correctOptionIndex: 0 },
            { text: "What represents the boundary of what is included in a software release?", options: ["Scope", "Backlog", "Velocity", "Milestone"], correctOptionIndex: 0 },
            { text: "What is requirements validation?", options: ["Compiling requirements code", "Confirming requirements accurately reflect customer needs", "Database constraint checks", "Unit test runs"], correctOptionIndex: 1 },
            { text: "Which of the following is a classic requirements elicitation technique?", options: ["Refactoring", "Interviews and Workshops", "Unit Testing", "Debugging"], correctOptionIndex: 1 },
            { text: "What is an epic in Agile?", options: ["A very long story", "A large, multi-module user story split into smaller cards", "A high-priority bug", "A master framework repository"], correctOptionIndex: 1 },
            { text: "What term describes requirements expanding uncontrollably during development?", options: ["Scope Creep", "Sprint Velocity", "Sprint Bloat", "Code Refactoring"], correctOptionIndex: 0 },
            { text: "Who is primary owner of the Software Requirements definition?", options: ["Developer", "QA Tester", "Product Owner / Business Analyst", "SysAdmin"], correctOptionIndex: 2 }
          ];
        case 3:
          return [
            { text: "What does UML stand for?", options: ["Unified Modeling Language", "Universal Markup Layout", "Unit Module Linker", "Unified Memory Allocation"], correctOptionIndex: 0 },
            { text: "Which UML diagram represents system classes, attributes, and methods?", options: ["Sequence Diagram", "Class Diagram", "Use Case Diagram", "State Diagram"], correctOptionIndex: 1 },
            { text: "Which UML diagram represents sequential runtime interactions over a timeline?", options: ["Class Diagram", "Sequence Diagram", "Deployment Diagram", "Activity Diagram"], correctOptionIndex: 1 },
            { text: "What is Monolithic Architecture?", options: ["Distributed microservices", "Unified system built as a single, self-contained unit", "Serverless cloud setup", "Containerized Docker nodes"], correctOptionIndex: 1 },
            { text: "What represents 'coupling' in system design?", options: ["Lines of code", "Degree of dependency between individual modules", "Execution threads count", "Database synchronization rates"], correctOptionIndex: 1 },
            { text: "For robust, maintainable systems, we strive for:", options: ["High coupling, low cohesion", "Low coupling, high cohesion", "High coupling, high cohesion", "Low coupling, low cohesion"], correctOptionIndex: 1 },
            { text: "What represents 'cohesion'?", options: ["Module dependency rates", "How focused and related responsibilities are inside a module", "Memory speeds", "Database replication intervals"], correctOptionIndex: 1 },
            { text: "Which UML diagram models high-level user actions and system boundaries?", options: ["Sequence Diagram", "Use Case Diagram", "Component Diagram", "State Chart"], correctOptionIndex: 1 },
            { text: "What design pattern guarantees a class has exactly one instance globally?", options: ["Factory", "Singleton", "Observer", "Strategy"], correctOptionIndex: 1 },
            { text: "What tier handles SQL database reads in a standard three-tier web setup?", options: ["Presentation Layer", "Application Logic Layer", "Data Persistence Layer", "Reverse Proxy Layer"], correctOptionIndex: 2 }
          ];
        case 4:
          return [
            { text: "What is Version Control?", options: ["Database backups", "System logging changes over time in repositories", "Operating system upgrades", "API routing metrics"], correctOptionIndex: 1 },
            { text: "Which tool represents a popular distributed version control system?", options: ["Git", "SVN", "VSS", "Mercurial only"], correctOptionIndex: 0 },
            { text: "What Git command initializes a local git repository?", options: ["git start", "git init", "git clone", "git create"], correctOptionIndex: 1 },
            { text: "What Git command stages modified files for committing?", options: ["git commit", "git push", "git add", "git stage-all"], correctOptionIndex: 2 },
            { text: "What Git command records staged snapshots permanently to local history?", options: ["git save", "git commit", "git push", "git archive"], correctOptionIndex: 1 },
            { text: "What is a Git branch?", options: ["Main trunk of code", "Parallel, isolated timeline of development", "Server duplicate backup", "Folder directory shortcut"], correctOptionIndex: 1 },
            { text: "What Git command merges a branch into active current branch?", options: ["git join", "git merge", "git blend", "git pull"], correctOptionIndex: 1 },
            { text: "Which cloud service hosts remote Git repositories?", options: ["Vite", "GitHub", "Docker", "Nginx"], correctOptionIndex: 1 },
            { text: "What Git command fetches updates and merges them from remote server?", options: ["git fetch", "git pull", "git merge-remote", "git sync"], correctOptionIndex: 1 },
            { text: "What is a merge conflict?", options: ["A developer argument", "Git failing to auto-merge overlapping edits in same file", "Server downtime", "Invalid code compilation"], correctOptionIndex: 1 }
          ];
        case 5:
          return [
            { text: "Which testing type validates isolated code blocks like methods?", options: ["System Testing", "Unit Testing", "Integration Testing", "Acceptance Testing"], correctOptionIndex: 1 },
            { text: "Which testing type validates combined interaction between multiple modules?", options: ["Unit Testing", "Integration Testing", "System Testing", "Performance Testing"], correctOptionIndex: 1 },
            { text: "What is Black Box testing?", options: ["Testing without knowing internal code mechanics", "Testing with full view of source code", "Beta testing by developers only", "Terminal diagnostics execution"], correctOptionIndex: 0 },
            { text: "What is White Box testing?", options: ["Testing with internal code logic visibility", "Testing without reading code", "User acceptance testing", "Serverless script running"], correctOptionIndex: 0 },
            { text: "What test automation practice builds unit tests before writing functional code?", options: ["Scrum delivery", "Test-Driven Development (TDD)", "Continuous Deployment", "Regression Mapping"], correctOptionIndex: 1 },
            { text: "What is regression testing?", options: ["Testing old hardware", "Re-running existing test suites to ensure changes didn't break things", "Stress testing database writes", "Compiler warning cleanups"], correctOptionIndex: 1 },
            { text: "What is a test double used to mock third-party API dependencies?", options: ["Test stub / Mock", "Assertion check", "Compiler debugger", "Git branch clone"], correctOptionIndex: 0 },
            { text: "Which testing verifies if the entire fully integrated application fits business goals?", options: ["Integration Testing", "System / Acceptance Testing (UAT)", "Smoke testing", "Unit validation"], correctOptionIndex: 1 },
            { text: "What represents test coverage?", options: ["Lines of code tested by automated test suites", "RAM utilization rates", "Network packet safety indexes", "Project backlog sizes"], correctOptionIndex: 0 },
            { text: "What is smoke testing?", options: ["Hardware stress check", "Rapid test sweep to ensure basic core features work", "Unit testing coverage reports", "Refactoring compiler logs"], correctOptionIndex: 1 }
          ];
        case 6:
          return [
            { text: "What is the sprint backlog?", options: ["Main master task list", "Selected tasks to accomplish in current sprint", "Unassigned bug tickets", "Archive code files"], correctOptionIndex: 1 },
            { text: "In Scrum, what velocity represents?", options: ["Server routing throughput", "Amount of story points completed by a team per sprint", "Developer typing speeds", "API response latency"], correctOptionIndex: 1 },
            { text: "What Scrum ceremony reflects on how to improve team processes?", options: ["Sprint Planning", "Sprint Retrospective", "Sprint Review", "Daily Standup"], correctOptionIndex: 1 },
            { text: "What chart visually tracks remaining work over sprint timelines?", options: ["Gantt Chart", "Burn-down Chart", "Pie chart", "Scatter plot"], correctOptionIndex: 1 },
            { text: "What represents Scrum poker?", options: ["Gambling games", "Estimating relative task complexities collectively", "Sprint retrospect ritual", "QA testing framework"], correctOptionIndex: 1 },
            { text: "What are story points?", options: ["Customer reviews", "Abstract units evaluating relative effort/size of a user story", "Database connection blocks", "Unit test outcomes"], correctOptionIndex: 1 },
            { text: "Which role represents voice of customer and owns prioritizations?", options: ["Scrum Master", "Product Owner", "Software Architect", "Technical Writer"], correctOptionIndex: 1 },
            { text: "What represents a Scrum product increment?", options: ["SRS documentation", "Working, tested, shippable code slice produced in a sprint", "Sprint velocity charts", "Raw class blueprints"], correctOptionIndex: 1 },
            { text: "What constitutes the definition of done (DoD)?", options: ["Typing code", "Agreed checklist confirming requirements, quality, and tests are passed", "Customer email acceptance", "Git commit complete"], correctOptionIndex: 1 },
            { text: "What represents risk management?", options: ["Backing up code", "Identifying, evaluating, and mitigating project threats", "Refactoring database indexes", "Filing patents"], correctOptionIndex: 1 }
          ];
        case 7:
          return [
            { text: "What defines restructuring existing code without changing external behaviors?", options: ["Compiling", "Refactoring", "Debugging", "Deploying"], correctOptionIndex: 1 },
            { text: "What term defines software deterioration over time due to patches and hacks?", options: ["Software Rot", "Software Leak", "Code Sandboxing", "Regression bloat"], correctOptionIndex: 0 },
            { text: "Which represents a typical code smell indicating duplicate code?", options: ["Single responsibility", "Copy-Paste redundancy", "Large Class", "Long method lines"], correctOptionIndex: 1 },
            { text: "What is CI/CD in modern software development pipelines?", options: ["Computer Integration / Code Delivery", "Continuous Integration and Continuous Delivery/Deployment", "Code Inspection / Controller Diagnostics", "Concurrent Interfaces / Database Synchronization"], correctOptionIndex: 1 },
            { text: "What is containerization?", options: ["Server virtualization", "Bundling application and all its dependencies into a lightweight runtime image", "Database compression", "Folder encapsulation"], correctOptionIndex: 1 },
            { text: "Which tool is standard for container virtualization?", options: ["Vite", "Docker", "Git", "Nginx"], correctOptionIndex: 1 },
            { text: "Which hosting strategy routes cloud traffic automatically?", options: ["Reverse Proxy (e.g. Nginx)", "Database partition", "Git branches", "Unit test runners"], correctOptionIndex: 0 },
            { text: "What defines hotfixing?", options: ["Rebooting servers", "Direct emergency patch implemented on production servers", "Code refactoring", "Scrum backlog estimates"], correctOptionIndex: 1 },
            { text: "What is technical debt?", options: ["Software licensing fees", "Future cost of choosing quick, hacky solutions over elegant designs", "Cloud hosting expenses", "Server maintenance budget"], correctOptionIndex: 1 },
            { text: "Which deployment strategy switches active traffic from Blue to Green environments?", options: ["Rolling update", "Blue-Green Deployment", "Canary testing", "A/B Testing"], correctOptionIndex: 1 }
          ];
        case 8:
          return [
            { text: "What is the focus of a Software Engineering Capstone Project?", options: ["Academic exam reading", "Building a complete, functional, integrated software system", "Writing research surveys", "Debugging standard hardware"], correctOptionIndex: 1 },
            { text: "Which capstone deliverable defines functional and non-functional requirements?", options: ["Syllabus", "SRS Document", "Git commit list", "UML Sequence Diagram"], correctOptionIndex: 1 },
            { text: "What does a UML diagram map out for the system design stage?", options: ["Line numbers of code", "Structural entities (Classes) and interactions (Sequence)", "Server hosting setups", "Database storage sizes"], correctOptionIndex: 1 },
            { text: "Why are automated testing reports critical before a major production deployment?", options: ["They increase speed limits", "They verify no regression errors are present", "They compile the software CJS formats", "They manage sprint velocity"], correctOptionIndex: 1 },
            { text: "What role does a Deployment Guide serve?", options: ["Outlines marketing plans", "Specifies steps to install, build, and run the system", "Contains custom quiz keys", "Documents scrum retrospects"], correctOptionIndex: 1 },
            { text: "What does a complete LMS system require as its core database entity?", options: ["Video playback loops", "Course and Module schemas", "Interactive canvas templates", "Telemetry log ports"], correctOptionIndex: 1 },
            { text: "Which design pattern is optimal for notifying students about new uploaded assignments?", options: ["Singleton Pattern", "Observer Pattern", "Adapter Pattern", "Facade Pattern"], correctOptionIndex: 1 },
            { text: "What prevents standard web cross-site scripting (XSS) issues in inputs?", options: ["Hashing keys", "Input sanitization and validation", "Docker containers", "Git branch merges"], correctOptionIndex: 1 },
            { text: "What defines clean code according to industry standards?", options: ["Extremely compact single lines", "Highly readable, modular, self-documenting code with tests", "Encrypted source files", "Zero comments"], correctOptionIndex: 1 },
            { text: "What is standard for verifying built assets in full-stack applications?", options: ["Lint and compile checking", "Running docker commands", "Rebooting express routers", "Generating image logos"], correctOptionIndex: 0 }
          ];
      }
    } else if (courseCode === 'MKT101') {
      switch (moduleNum) {
        case 1:
          return [
            { text: "What defines the digital marketing ecosystem?", options: ["Interconnected network of digital promotional channels, devices, and user touchpoints", "Operating system directory", "Computer hardware setup", "Local area networks"], correctOptionIndex: 0 },
            { text: "What represents organic marketing?", options: ["PPC bidding campaigns", "Unpaid promotional efforts driven by search and content quality", "Billboard postings", "SMS blasts"], correctOptionIndex: 1 },
            { text: "What KPI represents the percentage of website visitors that make a purchase?", options: ["CTR", "Bounce Rate", "Conversion Rate", "ROI"], correctOptionIndex: 2 },
            { text: "What model represents customer awareness, interest, desire, and action?", options: ["SOLID", "AIDA Model", "MECE Framework", "Scrum Cycle"], correctOptionIndex: 1 },
            { text: "Which channel provides direct, personalized, high-ROI corporate messaging?", options: ["Blogging", "Email Marketing", "Billboard advertising", "Social feed posts"], correctOptionIndex: 1 },
            { text: "What defines target audience segmentation?", options: ["Rebooting database records", "Grouping customers based on shared demographics, behaviors, or interests", "Compiling marketing reports", "Analyzing time-to-first-byte"], correctOptionIndex: 1 },
            { text: "What is customer acquisition cost (CAC)?", options: ["Product pricing", "Total cost spent to acquire a single customer", "Monthly marketing budget", "Sales employee wages"], correctOptionIndex: 1 },
            { text: "What represents customer lifetime value (LTV)?", options: ["Initial purchase price", "Total revenue a customer is projected to generate for a business over time", "Refund rate metrics", "Yearly brand equity"], correctOptionIndex: 1 },
            { text: "Which marketing channel focuses on organic search visibility?", options: ["PPC", "SEO", "SMM", "Affiliate Ads"], correctOptionIndex: 1 },
            { text: "What is bounce rate?", options: ["Email delivery failure rate", "Percentage of visitors who navigate away after viewing only one page", "Web hosting ping latency", "User scroll depth coefficient"], correctOptionIndex: 1 }
          ];
        case 2:
          return [
            { text: "What is a Landing Page?", options: ["Home page of a news outlet", "A dedicated, conversion-focused page designed for a specific campaign", "A database server status page", "Sitemap directory index"], correctOptionIndex: 1 },
            { text: "What process systematically improves landing page conversion rates?", options: ["Conversion Rate Optimization (CRO)", "Search engine crawls", "Git branching integrations", "Container virtualization"], correctOptionIndex: 0 },
            { text: "What is an A/B split test?", options: ["Testing two different compilers", "Comparing two versions of a webpage to see which performs better", "Running unit tests in parallel", "Auditing database writes"], correctOptionIndex: 1 },
            { text: "What represents a call to action (CTA)?", options: ["Customer help hotline", "A prominent button or link encouraging immediate user response", "A popup advertisement", "A search tracking parameter"], correctOptionIndex: 1 },
            { text: "Which metric measures the initial page load speed and user interaction readiness?", options: ["Click count", "Core Web Vitals", "Keywords density", "Social sharing metrics"], correctOptionIndex: 1 },
            { text: "What defines responsive design in web landing pages?", options: ["Pages that compile fast", "Pages that layout adaptively on mobile, tablet, and desktop screens", "Pages with interactive chat scripts", "Pages running on CJS formats"], correctOptionIndex: 1 },
            { text: "What constitutes the 'above the fold' section of a webpage?", options: ["Page footer links", "Content visible instantly without scrolling", "Source code index meta tags", "Privacy policy subpages"], correctOptionIndex: 1 },
            { text: "What represents social proof on a landing page?", options: ["Page load speed index", "Customer testimonials, reviews, and corporate logos", "Social media sharing links", "Google Ads tracking cookies"], correctOptionIndex: 1 },
            { text: "What is a bounce rate warning sign on landing pages?", options: ["Highly target SEO matches", "Extremely high bounce rate indicating poor match or slow loading", "Low customer acquisition cost", "Fast time-to-first-byte"], correctOptionIndex: 1 },
            { text: "What is lead generation?", options: ["Creating search bots", "Capturing interest of potential buyers and their contact information", "Sending direct invoices", "Automating website audits"], correctOptionIndex: 1 }
          ];
        case 3:
          return [
            { text: "What does SEO stand for?", options: ["Search Engine Optimization", "Social Engagement Outcome", "Secure Enterprise Operations", "Serial Encryption Protocol"], correctOptionIndex: 0 },
            { text: "What represents optimization done directly on webpage content and code?", options: ["Off-page SEO", "On-page SEO", "Technical SEO", "Black-Hat SEO"], correctOptionIndex: 1 },
            { text: "What is the primary focus of Off-page SEO?", options: ["Optimizing images", "Building authority and backlinks from other websites", "Writing robots.txt", "Improving page loading speeds"], correctOptionIndex: 1 },
            { text: "What file contains crawling instructions for search engine bots?", options: ["Sitemap.xml", "Robots.txt", "Index.html", "Package.json"], correctOptionIndex: 1 },
            { text: "What tag informs search engines of duplicate URL priority?", options: ["Meta descriptions", "Canonical Link Tag", "Robots follow directive", "Viewport declaration"], correctOptionIndex: 1 },
            { text: "What represents keyword density?", options: ["How many search hits occur", "How often a target keyword appears within webpage text", "The character length of keywords", "Database storage weight of terms"], correctOptionIndex: 1 },
            { text: "Which tag constitutes the main clickable headline in search results?", options: ["H1 tag", "Title Tag (<title>)", "Meta Description", "Anchor tag"], correctOptionIndex: 1 },
            { text: "What search console tool is standard to monitor organic index health?", options: ["Vite Devtools", "Google Search Console", "Google Analytics 4", "Meta Ads Manager"], correctOptionIndex: 1 },
            { text: "What defines search engine indexing?", options: ["Generating backlinks", "Bots parsing and storing webpage content in a search database", "Running paid PPC auctions", "Refactoring html tags"], correctOptionIndex: 1 },
            { text: "Which link tag tells search engines not to pass authority (page-rank)?", options: ["rel='canonical'", "rel='nofollow'", "rel='alternate'", "target='_blank'"], correctOptionIndex: 1 }
          ];
        case 4:
          return [
            { text: "What is Content Marketing?", options: ["Buying social media followers", "Creating and distributing valuable, relevant content to attract/retain audiences", "Launching daily email blasts", "Paid search keyword bidding"], correctOptionIndex: 1 },
            { text: "What represent individual target profile maps in content strategies?", options: ["Gantt blueprints", "Buyer Personas", "Scrum backlogs", "AIDA conversions"], correctOptionIndex: 1 },
            { text: "Which format is standard for organic B2B thought-leadership content?", options: ["Blogging and Whitepapers", "TikTok video loops", "Discount coupon emails", "Google Ads bidding"], correctOptionIndex: 0 },
            { text: "What is a content calendar?", options: ["A timeline showing holidays", "A scheduling blueprint planning what, when, and where content is published", "Search console index dates", "Scrum sprint board"], correctOptionIndex: 1 },
            { text: "What represent 'evergreen' content?", options: ["Eco-friendly marketing topics", "Content that remains relevant, valuable, and traffic-generating over long periods", "Short-lived seasonal discount details", "Weekly newsletters"], correctOptionIndex: 1 },
            { text: "What represents the 'TOFU' stage of content marketing funnels?", options: ["Top of the Funnel (Awareness)", "Total Outflow of User registrations", "Technical Optimization Focus Unit", "Tournament of Functional Users"], correctOptionIndex: 0 },
            { text: "What represents the 'MOFU' stage of marketing funnels?", options: ["Methodical Optimization Flow Unit", "Middle of the Funnel (Evaluation/Interest)", "Metric Outflow Filtering Utility", "Master Operation Funnel Upgrade"], correctOptionIndex: 1 },
            { text: "What represents the 'BOFU' stage of marketing funnels?", options: ["Bottom of the Funnel (Decision/Action)", "Break-Even Optimal Funnel Utility", "Business Outreach Forward Unit", "Broad-spectrum Organic Feature Unit"], correctOptionIndex: 0 },
            { text: "Which metric is critical to evaluate organic blog content retention?", options: ["Bounce rate", "Average Session Duration", "Server log latency", "Click-through rate of ads"], correctOptionIndex: 1 },
            { text: "What defines visual storytelling?", options: ["Writing clean html structures", "Using graphics, videos, and narratives to convey marketing messages", "Running social campaigns", "Designing database schemas"], correctOptionIndex: 1 }
          ];
        case 5:
          return [
            { text: "Which social platform is pre-eminent for professional, B2B digital marketing?", options: ["Facebook", "LinkedIn", "Instagram", "TikTok"], correctOptionIndex: 1 },
            { text: "What defines organic reach on social media feeds?", options: ["Paid sponsored views", "Number of unique users who view content without paid promotion", "Followers count multiplier", "Server bandwidth index"], correctOptionIndex: 1 },
            { text: "Which platform is highly driven by algorithmic short-form video loops for Gen-Z?", options: ["LinkedIn", "TikTok", "Facebook", "Twitter"], correctOptionIndex: 1 },
            { text: "What represents user-generated content (UGC)?", options: ["Corporate brochures", "Content created organically by real customers and shared online", "Automated marketing emails", "Stock photography assets"], correctOptionIndex: 1 },
            { text: "What does the abbreviation SMM stand for?", options: ["Social Media Marketing", "Symmetric Marketing Metric", "Search Module Manager", "Sprint Milestone Mapping"], correctOptionIndex: 0 },
            { text: "Which metric assesses how users interact with social posts via likes, shares, and comments?", options: ["CTR", "Engagement Rate", "Conversion rate", "Reach index"], correctOptionIndex: 1 },
            { text: "What is an influencer marketing strategy?", options: ["Hiring sales agents", "Partnering with content creators who have established niche credibility", "Buying fake followers", "Running search audit scripts"], correctOptionIndex: 1 },
            { text: "What represents the primary tool to manage Facebook and Instagram campaigns?", options: ["Search Console", "Meta Ads Manager", "Google Ads Command Center", "Vite Admin Portal"], correctOptionIndex: 1 },
            { text: "What is a viral marketing loop?", options: ["A software virus", "A mechanism encouraging users to organically share campaigns to peers", "Daily standup checklists", "PPC ad auction structures"], correctOptionIndex: 1 },
            { text: "Which hashtag best practices are standard on social channels?", options: ["Using 100 random tags", "Using limited, highly focused, categorizing tags related to content", "Omitting tags entirely", "Using tags inside HTML meta codes"], correctOptionIndex: 1 }
          ];
        case 6:
          return [
            { text: "What defines lead nurturing in email marketing?", options: ["Sending spam messages", "Building relationships with leads via helpful, automated email sequences", "Filing contact files", "Deleting inactive email addresses"], correctOptionIndex: 1 },
            { text: "What is a double opt-in?", options: ["Receiving two identical emails", "Confirming email subscription twice via a click confirmation link", "Subscribing to two blogs", "A CRM system database backup"], correctOptionIndex: 1 },
            { text: "What represents a trigger event in email automation?", options: ["Database crash", "User action (e.g. newsletter signup or checkout abandonment)", "Ffmpeg log generation", "Git branch creations"], correctOptionIndex: 1 },
            { text: "What is a standard metric assessing percentage of sent emails that are opened?", options: ["Open Rate", "Bounce Rate", "CTR", "Click-to-Open Rate (CTOR)"], correctOptionIndex: 0 },
            { text: "What is a standard metric assessing percentage of opened emails that had link clicks?", options: ["Open Rate", "CTOR (Click-to-Open Rate)", "Bounce Rate", "CTR of ads"], correctOptionIndex: 1 },
            { text: "Which represents a hard bounce in email delivery?", options: ["Server temporary down", "Permanent delivery failure due to invalid email address", "Email inbox full", "Spam filter blocks"], correctOptionIndex: 1 },
            { text: "Which represents a soft bounce in email delivery?", options: ["Permanent invalid address", "Temporary delivery issue like full recipient mailbox", "Unsubscribed contacts", "Blocked user filters"], correctOptionIndex: 1 },
            { text: "What regulatory act governs commercial emails and requires clear opt-out options?", options: ["GDPR / CAN-SPAM Act", "SDLC Standards", "SOLID Code rules", "UML specifications"], correctOptionIndex: 0 },
            { text: "What is a newsletter?", options: ["A corporate memo", "Periodic email update sent to subscribers with news, tips, or promotions", "Sitemap catalog", "Search crawler bot"], correctOptionIndex: 1 },
            { text: "What defines email list hygiene?", options: ["Cleaning computer cases", "Systematically scrubbing invalid, inactive, or unsubscribed contacts", "Re-sending bounce emails", "Encrypting email subject lines"], correctOptionIndex: 1 }
          ];
        case 7:
          return [
            { text: "What does PPC stand for in online advertising?", options: ["Pay-Per-Click", "Product Pricing Coefficient", "Plan-Prioritize-Commit", "Paid Promotional Channel"], correctOptionIndex: 0 },
            { text: "Which auction model governs Google search ads placement?", options: ["Real-time bidding based on Bid amount and Quality Score", "Waterfall model", "Fixed monthly pricing", "Chronological ordering"], correctOptionIndex: 0 },
            { text: "What metric determines Google Ads Quality Score?", options: ["CTR, Relevance, and Landing Page Experience", "Domain registration length", "Static HTML sizes", "Total pageviews count"], correctOptionIndex: 0 },
            { text: "What is cost per click (CPC)?", options: ["Price per impression", "Actual price paid to advertising networks for each click", "Conversion rate metric", "Yearly campaign overhead"], correctOptionIndex: 1 },
            { text: "What is cost per mille (CPM)?", options: ["Price per click", "Cost per 1,000 ad impressions", "Cost per lead conversion", "Search engine optimization fee"], correctOptionIndex: 1 },
            { text: "What represents remarketing / retargeting?", options: ["Changing product logos", "Targeting ads specifically to users who previously visited your website", "Posting on new social channels", "Re-writing search tags"], correctOptionIndex: 1 },
            { text: "What metric assesses paid advertising campaign profit ratios?", options: ["CTR", "ROAS (Return on Ad Spend)", "Bounce Rate", "LTV"], correctOptionIndex: 1 },
            { text: "Which Google Ads match type displays ads only when search queries match exact words?", options: ["Broad Match", "Phrase Match", "Exact Match", "Negative Match"], correctOptionIndex: 2 },
            { text: "What are negative keywords used for?", options: ["Expressing complaints", "Excluding searches that are irrelevant to your campaigns", "Finding cheap clicks", "SEO metadata keyword tags"], correctOptionIndex: 1 },
            { text: "What defines ad rank?", options: ["Length of description text", "Position of your ad in search results based on bid and quality score", "Click volume", "Organic seo page ranking"], correctOptionIndex: 1 }
          ];
        case 8:
          return [
            { text: "What is the primary deliverable of a Startup Digital Marketing Strategy?", options: ["Software SRS document", "Comprehensive Marketing Plan, budget, plan outline, and KPI dashboard", "Vite configurations", "Docker compose files"], correctOptionIndex: 1 },
            { text: "What represents a marketing KPI?", options: ["Key Performance Indicator tracking core campaign successes", "Keyword Program Index", "Kernel Performance Interface", "Knowledge Program Integration"], correctOptionIndex: 0 },
            { text: "What constitutes the conversion funnel?", options: ["Class structure diagrams", "Path of stages customer passes through from awareness to purchase", "Database SQL query index", "Network packet router configurations"], correctOptionIndex: 1 },
            { text: "Why is a KPI Dashboard critical for business stakeholders?", options: ["It compiles the software server.ts", "It visualizes real-time performance metrics in highly scannable graphs", "It hosts Git branches", "It automates attendance logs"], correctOptionIndex: 1 },
            { text: "What is cost per acquisition (CPA) on paid campaigns?", options: ["Hourly marketing fee", "Total promotional spend divided by total conversions", "Original click price", "Monthly domain pricing"], correctOptionIndex: 1 },
            { text: "Which attribution model credits conversion entirely to first user discovery click?", options: ["Last-Click attribution", "First-Click attribution", "Linear attribution", "Time-Decay attribution"], correctOptionIndex: 1 },
            { text: "Which attribution model credits conversion entirely to last checkout click?", options: ["First-Click attribution", "Last-Click attribution", "Linear attribution", "Position-Based attribution"], correctOptionIndex: 1 },
            { text: "What represents search engine share of voice (SOV)?", options: ["Microphone audio feeds", "Percentage of search engine visibility your brand owns vs competitors", "Sitemap index lines", "Robots follow commands"], correctOptionIndex: 1 },
            { text: "What is an advertising budget allocation plan?", options: ["Filing tax reports", "Strategic distribution of capital across marketing channels", "Refactoring code libraries", "Docker runtime options"], correctOptionIndex: 1 },
            { text: "What tool allows tracking UTM parameters to identify lead source?", options: ["Ffmpeg converter", "Google Analytics 4 / CRM tracking links", "Git bash terminal", "Vite build compiler"], correctOptionIndex: 1 }
          ];
      }
    }
    // Fallback: Default dummy questions if pool not matched
    return Array.from({ length: 10 }, (_, i) => ({
      text: `Default academic assessment question ${i + 1} for ${courseCode} Module ${moduleNum}?`,
      options: ["Correct Academic Option", "Alternative Option A", "Alternative Option B", "Alternative Option C"],
      correctOptionIndex: 0
    }));
  };

  const pool = getQuestionPool();
  pool.forEach((q, idx) => {
    questions.push({
      id: `${moduleId}_q_${idx + 1}`,
      text: q.text,
      options: q.options,
      correctOptionIndex: q.correctOptionIndex
    });
  });

  return {
    id: `quiz_gen_${moduleId}`,
    title: quizTitle,
    questions,
    timeLimit: 120 // 2 minutes
  };
}

export function getInitialCourses(): Course[] {
  return [
    {
      id: 'course_1',
      title: 'Introduction to Computer Science',
      code: 'CS101',
      description: 'Learn the fundamental concepts of computing, programming logic, algorithms, and computational thinking using Python.',
      department: 'Computer Science',
      instructor: 'Dr. Sarah Jenkins',
      isPublished: true,
      creditHours: 3,
      prerequisites: ['None'],
      learningOutcomes: [
        'Understand fundamental computer organization and architectural models like von Neumann.',
        'Formulate logical steps and flowcharts to solve computational problems.',
        'Write, debug, and execute clean, structured Python code.',
        'Understand linear data structure concepts and basic operating system capabilities.'
      ],
      durationWeeks: 16,
      modules: [
        {
          id: 'c1_m1',
          title: 'Module 1: Introduction to Computing',
          lessons: [
            { id: 'c1_l1', title: 'Lesson 1.1: History of Computers & Structural Evolution', type: 'video', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', duration: '09:56', completed: false, progressPercent: 0 },
            { id: 'c1_l2', title: 'Lesson 1.2: Reading Material - Von Neumann Architecture', type: 'pdf', pdfUrl: '/documents/cs101_module1.pdf', duration: '15 min read', completed: false },
            { id: 'c1_l2_asg', title: 'Assignment 1.1: History of Computing & Generations Report', type: 'pdf', pdfUrl: '/documents/cs101_asg_1_1.pdf', duration: '3 hours estimate', completed: false },
            { id: 'c1_l3', title: 'Module 1 Weekly Evaluation Quiz', type: 'quiz', quiz: generateWeeklyQuiz('CS101', 1, 'c1_m1') }
          ]
        },
        {
          id: 'c1_m2',
          title: 'Module 2: Computer Systems & Hardware',
          lessons: [
            { id: 'c1_l4', title: 'Lesson 2.1: CPU Core Architectures & Instruction Cycles', type: 'video', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', duration: '10:53', completed: false, progressPercent: 0 },
            { id: 'c1_l5', title: 'Lesson 2.2: Reading Material - Hardware Registers & RAM', type: 'pdf', pdfUrl: '/documents/cs101_python_syntax.pdf', duration: '12 min read', completed: false },
            { id: 'c1_l5_lab', title: 'Lab 2.1: Hardware Assembly & Specification Audits', type: 'pdf', pdfUrl: '/documents/cs101_lab_2_1.pdf', duration: '2 hours estimate', completed: false },
            { id: 'c1_l6', title: 'Module 2 Weekly Evaluation Quiz', type: 'quiz', quiz: generateWeeklyQuiz('CS101', 2, 'c1_m2') }
          ]
        },
        {
          id: 'c1_m3',
          title: 'Module 3: Operating Systems & System Logic',
          lessons: [
            { id: 'c1_l7', title: 'Lesson 3.1: Kernel Routines & Memory Allocators', type: 'video', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', duration: '07:45', completed: false, progressPercent: 0 },
            { id: 'c1_l8', title: 'Lesson 3.2: Definite vs Indefinite Loop Traverses', type: 'video', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', duration: '11:12', completed: false, progressPercent: 0 },
            { id: 'c1_l8_pe', title: 'Practical Exercise: File Organization & Shell Command Scripting', type: 'pdf', pdfUrl: '/documents/cs101_pe_3_1.pdf', duration: '2 hours estimate', completed: false },
            { id: 'c1_l9', title: 'Module 3 Weekly Evaluation Quiz', type: 'quiz', quiz: generateWeeklyQuiz('CS101', 3, 'c1_m3') }
          ]
        },
        {
          id: 'c1_m4',
          title: 'Module 4: Programming Fundamentals',
          lessons: [
            { id: 'c1_l10', title: 'Lesson 4.1: Custom Declared Variables & Data Types', type: 'video', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4', duration: '09:20', completed: false, progressPercent: 0 },
            { id: 'c1_l11', title: 'Lesson 4.2: Reading Material - Standard Input/Output and Scope', type: 'pdf', pdfUrl: '/documents/cs101_function_scope.pdf', duration: '10 min read', completed: false },
            { id: 'c1_l11_cl', title: 'Coding Lab 4.1: Building a Command-Line Multi-Function Calculator', type: 'pdf', pdfUrl: '/documents/cs101_cl_4_1.pdf', duration: '4 hours estimate', completed: false },
            { id: 'c1_l12', title: 'Module 4 Weekly Evaluation Quiz', type: 'quiz', quiz: generateWeeklyQuiz('CS101', 4, 'c1_m4') }
          ]
        },
        {
          id: 'c1_m5',
          title: 'Module 5: Control Structures',
          lessons: [
            { id: 'c1_l13', title: 'Lesson 5.1: Conditional Branching (If-Else) Logic', type: 'video', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4', duration: '08:45', completed: false, progressPercent: 0 },
            { id: 'c1_l14', title: 'Lesson 5.2: Reading Material - Switch Cases and Loop Controls', type: 'pdf', pdfUrl: '/documents/cs101_loops.pdf', duration: '15 min read', completed: false },
            { id: 'c1_l14_asg', title: 'Assignment 5.1: Automated Student Grading & Report Card Generator', type: 'pdf', pdfUrl: '/documents/cs101_asg_5_1.pdf', duration: '3 hours estimate', completed: false },
            { id: 'c1_l15', title: 'Module 5 Weekly Evaluation Quiz', type: 'quiz', quiz: generateWeeklyQuiz('CS101', 5, 'c1_m5') }
          ]
        },
        {
          id: 'c1_m6',
          title: 'Module 6: Functions & Modular Programming',
          lessons: [
            { id: 'c1_l16', title: 'Lesson 6.1: Declaring Functions, Parameters, & Callbacks', type: 'video', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4', duration: '10:30', completed: false, progressPercent: 0 },
            { id: 'c1_l17', title: 'Lesson 6.2: Reading Material - Variable Namespaces & Recursive Returns', type: 'pdf', pdfUrl: '/documents/cs101_recursion.pdf', duration: '12 min read', completed: false },
            { id: 'c1_l17_proj', title: 'Coding Project 6.1: CLI ATM & Bank Account Simulator with Ledger Logs', type: 'pdf', pdfUrl: '/documents/cs101_proj_6_1.pdf', duration: '5 hours estimate', completed: false },
            { id: 'c1_l18', title: 'Module 6 Weekly Evaluation Quiz', type: 'quiz', quiz: generateWeeklyQuiz('CS101', 6, 'c1_m6') }
          ]
        },
        {
          id: 'c1_m7',
          title: 'Module 7: Data Structures Basics',
          lessons: [
            { id: 'c1_l19', title: 'Lesson 7.1: Contiguous Arrays and Dynamic List Memory Maps', type: 'video', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4', duration: '12:15', completed: false, progressPercent: 0 },
            { id: 'c1_l20', title: 'Lesson 7.2: Reading Material - Stacks and Queues LIFO/FIFO Operations', type: 'pdf', pdfUrl: '/documents/cs101_datastructures.pdf', duration: '18 min read', completed: false },
            { id: 'c1_l21', title: 'Module 7 Weekly Evaluation Quiz', type: 'quiz', quiz: generateWeeklyQuiz('CS101', 7, 'c1_m7') }
          ]
        },
        {
          id: 'c1_m8',
          title: 'Module 8: Final Project',
          lessons: [
            { id: 'c1_l22', title: 'Lesson 8.1: Semester Summary, Exam Blueprints & Design Specifications', type: 'video', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4', duration: '14:20', completed: false, progressPercent: 0 },
            { id: 'c1_l23', title: 'Lesson 8.2: Reading Material - Full Curriculum Review Handbook', type: 'pdf', pdfUrl: '/documents/cs101_final_review.pdf', duration: '30 min read', completed: false },
            { id: 'c1_l23_proj', title: 'Final Course Project: Structured Student Management System Database', type: 'pdf', pdfUrl: '/documents/cs101_sms_project.pdf', duration: '10 hours estimate', completed: false },
            { id: 'c1_l24', title: 'Module 8 Weekly Evaluation Quiz', type: 'quiz', quiz: generateWeeklyQuiz('CS101', 8, 'c1_m8') }
          ]
        }
      ]
    },
    {
      id: 'course_2',
      title: 'Data Structures & Algorithms',
      code: 'CS201',
      description: 'Master advanced algorithms, complexity analysis, arrays, lists, queues, stacks, hash tables, trees, and dynamic programming.',
      department: 'Computer Science',
      instructor: 'Dr. Sarah Jenkins',
      isPublished: true,
      creditHours: 4,
      prerequisites: ['CS101 - Introduction to Computer Science'],
      learningOutcomes: [
        'Analyze algorithm runtime and memory efficiency using Big-O notation.',
        'Implement and optimize fundamental data structures like stacks, queues, and linked lists.',
        'Design and traverse complex structures including BSTs, AVL trees, and graphs.',
        'Apply sorting, searching, and traversal algorithms to solve real-world system bottlenecks.'
      ],
      durationWeeks: 16,
      modules: [
        {
          id: 'c2_m1',
          title: 'Module 1: Algorithm Analysis',
          lessons: [
            { id: 'c2_l1', title: 'Lesson 1.1: Big O Notation & Runtime Growth Functions', type: 'video', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', duration: '08:15', completed: false, progressPercent: 0 },
            { id: 'c2_l2', title: 'Lesson 1.2: Reading Material - Complexity Quick Reference Chart', type: 'pdf', pdfUrl: '/documents/cs201_complexity_cheat.pdf', duration: '10 min read', completed: false },
            { id: 'c2_l2_asg', title: 'Assignment 1.1: Formal Run-time Performance & Space Audit Reports', type: 'pdf', pdfUrl: '/documents/cs201_asg_1_1.pdf', duration: '4 hours estimate', completed: false },
            { id: 'c2_l3', title: 'Module 1 Weekly Evaluation Quiz', type: 'quiz', quiz: generateWeeklyQuiz('CS201', 1, 'c2_m1') }
          ]
        },
        {
          id: 'c2_m2',
          title: 'Module 2: Arrays and Linked Lists',
          lessons: [
            { id: 'c2_l4', title: 'Lesson 2.1: Static contiguous Arrays vs Dynamic Linked Node Chains', type: 'video', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', duration: '12:45', completed: false, progressPercent: 0 },
            { id: 'c2_l5', title: 'Lesson 2.2: Singly & Doubly Linked List Architectures', type: 'video', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4', duration: '10:15', completed: false, progressPercent: 0 },
            { id: 'c2_l5_lab', title: 'Lab 2.1: Custom Double-Linked List Implementation', type: 'pdf', pdfUrl: '/documents/cs201_lab_2_1.pdf', duration: '3 hours estimate', completed: false },
            { id: 'c2_l6', title: 'Module 2 Weekly Evaluation Quiz', type: 'quiz', quiz: generateWeeklyQuiz('CS201', 2, 'c2_m2') }
          ]
        },
        {
          id: 'c2_m3',
          title: 'Module 3: Stacks and Queues',
          lessons: [
            { id: 'c2_l7', title: 'Lesson 3.1: Stack Implementations & Parentheses Match Solutions', type: 'video', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4', duration: '14:20', completed: false, progressPercent: 0 },
            { id: 'c2_l8', title: 'Lesson 3.2: Queue structures & Circular Buffer Operations', type: 'pdf', pdfUrl: '/documents/cs201_hash_collisions.pdf', duration: '18 min read', completed: false },
            { id: 'c2_l8_ex', title: 'Coding Exercise 3.1: Custom Stack & Circular Queue Implementation', type: 'pdf', pdfUrl: '/documents/cs201_ex_3_1.pdf', duration: '3 hours estimate', completed: false },
            { id: 'c2_l9', title: 'Module 3 Weekly Evaluation Quiz', type: 'quiz', quiz: generateWeeklyQuiz('CS201', 3, 'c2_m3') }
          ]
        },
        {
          id: 'c2_m4',
          title: 'Module 4: Trees',
          lessons: [
            { id: 'c2_l10', title: 'Lesson 4.1: Hierarchical Trees and Binary Search Tree (BST) Properties', type: 'video', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4', duration: '11:05', completed: false, progressPercent: 0 },
            { id: 'c2_l11', title: 'Lesson 4.2: Self-Balancing AVL Trees and Rotations', type: 'video', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4', duration: '15:30', completed: false, progressPercent: 0 },
            { id: 'c2_l11_lab', title: 'Lab 4.1: Recursive Binary Search Tree Traversal Algorithms', type: 'pdf', pdfUrl: '/documents/cs201_lab_4_1.pdf', duration: '4 hours estimate', completed: false },
            { id: 'c2_l12', title: 'Module 4 Weekly Evaluation Quiz', type: 'quiz', quiz: generateWeeklyQuiz('CS201', 4, 'c2_m4') }
          ]
        },
        {
          id: 'c2_m5',
          title: 'Module 5: Graphs',
          lessons: [
            { id: 'c2_l13', title: 'Lesson 5.1: Graph Matrix Representations & BFS Algorithms', type: 'video', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', duration: '09:40', completed: false, progressPercent: 0 },
            { id: 'c2_l14', title: 'Lesson 5.2: Depth First Search (DFS) & Dijkstra Path Routing', type: 'pdf', pdfUrl: '/documents/cs201_graphs.pdf', duration: '15 min read', completed: false },
            { id: 'c2_l14_proj', title: 'Coding Project 5.1: Directed Social Network Graph System Analysis', type: 'pdf', pdfUrl: '/documents/cs201_proj_5_1.pdf', duration: '6 hours estimate', completed: false },
            { id: 'c2_l15', title: 'Module 5 Weekly Evaluation Quiz', type: 'quiz', quiz: generateWeeklyQuiz('CS201', 5, 'c2_m5') }
          ]
        },
        {
          id: 'c2_m6',
          title: 'Module 6: Sorting Algorithms',
          lessons: [
            { id: 'c2_l16', title: 'Lesson 6.1: Bubble Sort, Selection Sort, and Insertion Sort', type: 'video', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', duration: '13:20', completed: false, progressPercent: 0 },
            { id: 'c2_l17', title: 'Lesson 6.2: Divide-and-Conquer: Merge Sort vs Quick Sort', type: 'pdf', pdfUrl: '/documents/cs201_sorting_analysis.pdf', duration: '20 min read', completed: false },
            { id: 'c2_l18', title: 'Module 6 Weekly Evaluation Quiz', type: 'quiz', quiz: generateWeeklyQuiz('CS201', 6, 'c2_m6') }
          ]
        },
        {
          id: 'c2_m7',
          title: 'Module 7: Searching Algorithms',
          lessons: [
            { id: 'c2_l19', title: 'Lesson 7.1: Sequential Linear Search vs Divide Sorted Binary Search', type: 'video', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4', duration: '11:45', completed: false, progressPercent: 0 },
            { id: 'c2_l20', title: 'Lesson 7.2: Reading Material - Hashing Lookup & Bucket Collisions', type: 'pdf', pdfUrl: '/documents/cs201_hashing.pdf', duration: '16 min read', completed: false },
            { id: 'c2_l21', title: 'Module 7 Weekly Evaluation Quiz', type: 'quiz', quiz: generateWeeklyQuiz('CS201', 7, 'c2_m7') }
          ]
        },
        {
          id: 'c2_m8',
          title: 'Module 8: Final Project',
          lessons: [
            { id: 'c2_l22', title: 'Lesson 8.1: Algorithms Integration & System Complexity Optimization', type: 'video', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4', duration: '15:10', completed: false, progressPercent: 0 },
            { id: 'c2_l23', title: 'Lesson 8.2: Reading Material - Semester Final Examination Review Guide', type: 'pdf', pdfUrl: '/documents/cs201_final_guide.pdf', duration: '30 min read', completed: false },
            { id: 'c2_l23_proj', title: 'Final Semester Capstone: High-Performance Library Management System', type: 'pdf', pdfUrl: '/documents/cs201_lms_capstone.pdf', duration: '12 hours estimate', completed: false },
            { id: 'c2_l24', title: 'Module 8 Weekly Evaluation Quiz', type: 'quiz', quiz: generateWeeklyQuiz('CS201', 8, 'c2_m8') }
          ]
        }
      ]
    },
    {
      id: 'course_3',
      title: 'Software Engineering Principles',
      code: 'CS301',
      description: 'Learn system design, agile methodologies, SOLID design principles, unified modeling language (UML), and developer best practices.',
      department: 'Computer Science',
      instructor: 'Dr. Sarah Jenkins',
      isPublished: true,
      creditHours: 3,
      prerequisites: ['CS201 - Data Structures & Algorithms'],
      learningOutcomes: [
        'Manage modern software lifecycle processes using Agile/Scrum frameworks.',
        'Document clear functional and non-functional specifications using SRS standards.',
        'Design robust system architectures using SOLID object-oriented principles and UML diagrams.',
        'Establish continuous integration, test automation, and code refactoring workflows.'
      ],
      durationWeeks: 16,
      modules: [
        {
          id: 'c3_m1',
          title: 'Module 1: Agile Software Development',
          lessons: [
            { id: 'c3_l1', title: 'Lesson 1.1: Managing Scrum Sprints & Agile Backlogs', type: 'video', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', duration: '07:30', completed: false, progressPercent: 0 },
            { id: 'c3_l2', title: 'Lesson 1.2: Reading Material - Scrum Roles, Ceremonies, & Rituals', type: 'pdf', pdfUrl: '/documents/cs301_scrum_guide.pdf', duration: '15 min read', completed: false },
            { id: 'c3_l3', title: 'Module 1 Weekly Evaluation Quiz', type: 'quiz', quiz: generateWeeklyQuiz('CS301', 1, 'c3_m1') }
          ]
        },
        {
          id: 'c3_m2',
          title: 'Module 2: Requirements Engineering',
          lessons: [
            { id: 'c3_l4', title: 'Lesson 2.1: Functional vs Non-functional Requirements & Scope', type: 'video', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4', duration: '13:10', completed: false, progressPercent: 0 },
            { id: 'c3_l5', title: 'Lesson 2.2: Agile User Stories & Elicitation Workshops', type: 'video', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4', duration: '15:20', completed: false, progressPercent: 0 },
            { id: 'c3_l5_asg', title: 'Assignment 2.1: Software Requirement Specification (SRS) Drafting', type: 'pdf', pdfUrl: '/documents/cs301_asg_2_1.pdf', duration: '5 hours estimate', completed: false },
            { id: 'c3_l6', title: 'Module 2 Weekly Evaluation Quiz', type: 'quiz', quiz: generateWeeklyQuiz('CS301', 2, 'c3_m2') }
          ]
        },
        {
          id: 'c3_m3',
          title: 'Module 3: System Design',
          lessons: [
            { id: 'c3_l7', title: 'Lesson 3.1: Monolithic vs Distributed Microservice Architectures', type: 'video', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4', duration: '11:45', completed: false, progressPercent: 0 },
            { id: 'c3_l8', title: 'Lesson 3.2: Unified Modeling Language: Class & Sequence Diagrams', type: 'pdf', pdfUrl: '/documents/cs301_uml_diagrams.pdf', duration: '22 min read', completed: false },
            { id: 'c3_l8_lab', title: 'Lab 3.1: Drawing Structured UML Class & Interaction Models', type: 'pdf', pdfUrl: '/documents/cs301_lab_3_1.pdf', duration: '3 hours estimate', completed: false },
            { id: 'c3_l9', title: 'Module 3 Weekly Evaluation Quiz', type: 'quiz', quiz: generateWeeklyQuiz('CS301', 3, 'c3_m3') }
          ]
        },
        {
          id: 'c3_m4',
          title: 'Module 4: Software Development',
          lessons: [
            { id: 'c3_l10', title: 'Lesson 4.1: Professional Coding Standards & Linting Configurations', type: 'video', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4', duration: '14:50', completed: false, progressPercent: 0 },
            { id: 'c3_l11', title: 'Lesson 4.2: Distributed Version Control: Git & GitHub branching', type: 'pdf', pdfUrl: '/documents/cs301_cicd_pipelines.pdf', duration: '14 min read', completed: false },
            { id: 'c3_l11_pr', title: 'Practical Exercise: Git Workflow & Merge Conflict Resolution', type: 'pdf', pdfUrl: '/documents/cs301_pe_4_1.pdf', duration: '2 hours estimate', completed: false },
            { id: 'c3_l12', title: 'Module 4 Weekly Evaluation Quiz', type: 'quiz', quiz: generateWeeklyQuiz('CS301', 4, 'c3_m4') }
          ]
        },
        {
          id: 'c3_m5',
          title: 'Module 5: Software Testing',
          lessons: [
            { id: 'c3_l13', title: 'Lesson 5.1: Automated Unit Testing with Mocks & Assertions', type: 'video', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', duration: '11:20', completed: false, progressPercent: 0 },
            { id: 'c3_l14', title: 'Lesson 5.2: Reading Material - Integration, Regression & System Tests', type: 'pdf', pdfUrl: '/documents/cs301_testing.pdf', duration: '18 min read', completed: false },
            { id: 'c3_l14_asg', title: 'Assignment 5.1: Comprehensive Test Plan and Suite Specification Development', type: 'pdf', pdfUrl: '/documents/cs301_asg_5_1.pdf', duration: '4 hours estimate', completed: false },
            { id: 'c3_l15', title: 'Module 5 Weekly Evaluation Quiz', type: 'quiz', quiz: generateWeeklyQuiz('CS301', 5, 'c3_m5') }
          ]
        },
        {
          id: 'c3_m6',
          title: 'Module 6: Project Management',
          lessons: [
            { id: 'c3_l16', title: 'Lesson 6.1: Agile Estimation, Scrum Poker & Velocity metrics', type: 'video', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', duration: '12:45', completed: false, progressPercent: 0 },
            { id: 'c3_l17', title: 'Lesson 6.2: Reading Material - Risk Management & Task Allocation', type: 'pdf', pdfUrl: '/documents/cs301_management.pdf', duration: '15 min read', completed: false },
            { id: 'c3_l18', title: 'Module 6 Weekly Evaluation Quiz', type: 'quiz', quiz: generateWeeklyQuiz('CS301', 6, 'c3_m6') }
          ]
        },
        {
          id: 'c3_m7',
          title: 'Module 7: Software Maintenance & CD',
          lessons: [
            { id: 'c3_l19', title: 'Lesson 7.1: Safe Code Refactoring & Dependency Management', type: 'video', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4', duration: '10:15', completed: false, progressPercent: 0 },
            { id: 'c3_l20', title: 'Lesson 7.2: Reading Material - Containerization & Docker Blueprints', type: 'pdf', pdfUrl: '/documents/cs301_maintenance.pdf', duration: '16 min read', completed: false },
            { id: 'c3_l21', title: 'Module 7 Weekly Evaluation Quiz', type: 'quiz', quiz: generateWeeklyQuiz('CS301', 7, 'c3_m7') }
          ]
        },
        {
          id: 'c3_m8',
          title: 'Module 8: Capstone Project',
          lessons: [
            { id: 'c3_l22', title: 'Lesson 8.1: Large Scale Multi-Module Systems Architecture Blueprint', type: 'video', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4', duration: '15:30', completed: false, progressPercent: 0 },
            { id: 'c3_l23', title: 'Lesson 8.2: Reading Material - Capstone Engineering Design Handbooks', type: 'pdf', pdfUrl: '/documents/cs301_capstone_handbook.pdf', duration: '25 min read', completed: false },
            { id: 'c3_l23_proj', title: 'Capstone Project: Complete LMS System Implementation', type: 'pdf', pdfUrl: '/documents/cs301_capstone_project.pdf', duration: '15 hours estimate', completed: false },
            { id: 'c3_l24', title: 'Module 8 Weekly Evaluation Quiz', type: 'quiz', quiz: generateWeeklyQuiz('CS301', 8, 'c3_m8') }
          ]
        }
      ]
    },
    {
      id: 'course_4',
      title: 'Digital Marketing Essentials',
      code: 'MKT101',
      description: 'An overview of digital promotional channels, SEO fundamentals, pay-per-click strategies, conversion marketing, and analytics dashboards.',
      department: 'Business Administration',
      instructor: 'Elena Rostova',
      isPublished: true,
      creditHours: 3,
      prerequisites: ['None'],
      learningOutcomes: [
        'Navigate the digital promotional channel ecosystem and content funnels.',
        'Audit, research, and optimize search engine visibility (SEO).',
        'Structure, bidding-optimize, and analyze paid search campaigns (PPC/Google Ads).',
        'Design comprehensive cross-channel digital marketing plans for brand awareness and lead conversion.'
      ],
      durationWeeks: 16,
      modules: [
        {
          id: 'c4_m1',
          title: 'Module 1: Introduction to Digital Marketing',
          lessons: [
            { id: 'c4_l1', title: 'Lesson 1.1: Core Marketing Funnels & Organic Customer Journeys', type: 'video', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', duration: '05:40', completed: false, progressPercent: 0 },
            { id: 'c4_l2', title: 'Lesson 1.2: Reading Material - The Multi-Channel Digital Ecosystem', type: 'pdf', pdfUrl: '/documents/mkt101_seo_guide.pdf', duration: '20 min read', completed: false },
            { id: 'c4_l3', title: 'Module 1 Weekly Evaluation Quiz', type: 'quiz', quiz: generateWeeklyQuiz('MKT101', 1, 'c4_m1') }
          ]
        },
        {
          id: 'c4_m2',
          title: 'Module 2: Website Marketing',
          lessons: [
            { id: 'c4_l4', title: 'Lesson 2.1: Conversion Rate Optimization & Landing Page Layouts', type: 'video', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4', duration: '11:15', completed: false, progressPercent: 0 },
            { id: 'c4_l5', title: 'Lesson 2.2: Reading Material - UX design and Call-To-Action (CTA) positioning', type: 'pdf', pdfUrl: '/documents/mkt101_landing_pages.pdf', duration: '15 min read', completed: false },
            { id: 'c4_l5_asg', title: 'Assignment 2.1: Conversion-Focused Business Landing Page Blueprint Creation', type: 'pdf', pdfUrl: '/documents/mkt101_asg_2_1.pdf', duration: '4 hours estimate', completed: false },
            { id: 'c4_l6', title: 'Module 2 Weekly Evaluation Quiz', type: 'quiz', quiz: generateWeeklyQuiz('MKT101', 2, 'c4_m2') }
          ]
        },
        {
          id: 'c4_m3',
          title: 'Module 3: SEO (Search Engine Optimization)',
          lessons: [
            { id: 'c4_l7', title: 'Lesson 3.1: Keyword Research & On-page Meta Optimization', type: 'video', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4', duration: '12:50', completed: false, progressPercent: 0 },
            { id: 'c4_l8', title: 'Lesson 3.2: Reading Material - Crawlers, XML sitemaps, and Robots.txt files', type: 'pdf', pdfUrl: '/documents/mkt101_social_branding.pdf', duration: '12 min read', completed: false },
            { id: 'c4_l8_pr', title: 'Practical Exercise: Website Technical SEO Auditing & Optimization', type: 'pdf', pdfUrl: '/documents/mkt101_pe_3_1.pdf', duration: '3 hours estimate', completed: false },
            { id: 'c4_l9', title: 'Module 3 Weekly Evaluation Quiz', type: 'quiz', quiz: generateWeeklyQuiz('MKT101', 3, 'c4_m3') }
          ]
        },
        {
          id: 'c4_m4',
          title: 'Module 4: Content Marketing',
          lessons: [
            { id: 'c4_l10', title: 'Lesson 4.1: Inbound Content Strategies & Brand Storytelling', type: 'video', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4', duration: '14:10', completed: false, progressPercent: 0 },
            { id: 'c4_l11', title: 'Lesson 4.2: Reading Material - Formulating UTM links & conversion targets', type: 'pdf', pdfUrl: '/documents/mkt101_utm_tracking.pdf', duration: '18 min read', completed: false },
            { id: 'c4_l11_asg', title: 'Assignment 4.1: Brand Editorial & Inbound Content Calendar Development', type: 'pdf', pdfUrl: '/documents/mkt101_asg_4_1.pdf', duration: '3 hours estimate', completed: false },
            { id: 'c4_l12', title: 'Module 4 Weekly Evaluation Quiz', type: 'quiz', quiz: generateWeeklyQuiz('MKT101', 4, 'c4_m4') }
          ]
        },
        {
          id: 'c4_m5',
          title: 'Module 5: Social Media Marketing',
          lessons: [
            { id: 'c4_l13', title: 'Lesson 5.1: B2B vs B2C social platforms and organic feeds', type: 'video', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', duration: '11:30', completed: false, progressPercent: 0 },
            { id: 'c4_l14', title: 'Lesson 5.2: Reading Material - Influencer Outreach & compliance regulations', type: 'pdf', pdfUrl: '/documents/mkt101_social.pdf', duration: '14 min read', completed: false },
            { id: 'c4_l14_proj', title: 'Campaign Project: Cross-Platform Social Campaign design & mock files', type: 'pdf', pdfUrl: '/documents/mkt101_proj_5_1.pdf', duration: '5 hours estimate', completed: false },
            { id: 'c4_l15', title: 'Module 5 Weekly Evaluation Quiz', type: 'quiz', quiz: generateWeeklyQuiz('MKT101', 5, 'c4_m5') }
          ]
        },
        {
          id: 'c4_m6',
          title: 'Module 6: Email Marketing',
          lessons: [
            { id: 'c4_l16', title: 'Lesson 6.1: Opt-in lead captures and dual verification systems', type: 'video', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', duration: '12:20', completed: false, progressPercent: 0 },
            { id: 'c4_l17', title: 'Lesson 6.2: Reading Material - Email list hygiene & click metrics CTOR', type: 'pdf', pdfUrl: '/documents/mkt101_email.pdf', duration: '15 min read', completed: false },
            { id: 'c4_l18', title: 'Module 6 Weekly Evaluation Quiz', type: 'quiz', quiz: generateWeeklyQuiz('MKT101', 6, 'c4_m6') }
          ]
        },
        {
          id: 'c4_m7',
          title: 'Module 7: Paid Advertising',
          lessons: [
            { id: 'c4_l19', title: 'Lesson 7.1: Google Ads real-time bidding & Quality Score systems', type: 'video', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', duration: '13:05', completed: false, progressPercent: 0 },
            { id: 'c4_l20', title: 'Lesson 7.2: Reading Material - Meta Ads custom audiences & PPC tactics', type: 'pdf', pdfUrl: '/documents/mkt101_ppc.pdf', duration: '16 min read', completed: false },
            { id: 'c4_l20_sim', title: 'PPC Bidding Simulation: Setting Budgets, CPC estimates, and ROI forecasts', type: 'pdf', pdfUrl: '/documents/mkt101_sim_7_1.pdf', duration: '4 hours estimate', completed: false },
            { id: 'c4_l21', title: 'Module 7 Weekly Evaluation Quiz', type: 'quiz', quiz: generateWeeklyQuiz('MKT101', 7, 'c4_m7') }
          ]
        },
        {
          id: 'c4_m8',
          title: 'Module 8: Final Project',
          lessons: [
            { id: 'c4_l22', title: 'Lesson 8.1: Strategic Marketing Analytics & Funnel attribution modeling', type: 'video', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4', duration: '15:20', completed: false, progressPercent: 0 },
            { id: 'c4_l23', title: 'Lesson 8.2: Reading Material - Comprehensive Pitching Decks for Startup brands', type: 'pdf', pdfUrl: '/documents/mkt101_final_guide.pdf', duration: '20 min read', completed: false },
            { id: 'c4_l23_proj', title: 'Final Marketing Capstone: Complete Digital Marketing Plan for an Early-stage Startup', type: 'pdf', pdfUrl: '/documents/mkt101_startup_plan.pdf', duration: '15 hours estimate', completed: false },
            { id: 'c4_l24', title: 'Module 8 Weekly Evaluation Quiz', type: 'quiz', quiz: generateWeeklyQuiz('MKT101', 8, 'c4_m8') }
          ]
        }
      ]
    },
    {
      id: 'course_5',
      title: 'Business Communication',
      code: 'BUS102',
      description: 'Develop executive writing, professional persuasion techniques, critical board presentations, and internal communication hierarchies.',
      department: 'Business Administration',
      instructor: 'Prof. Marcus Aurelius',
      isPublished: true,
      creditHours: 3,
      prerequisites: ['None'],
      learningOutcomes: [
        'Apply the Minto Pyramid Principle in corporate memorandums.',
        'Design executive summaries and direct pitch slide decks.',
        'Manage difficult Q&A boardroom scenarios under pressure.',
        'Adopt constructive feedback structures like the SBI model.'
      ],
      durationWeeks: 16,
      modules: [
        {
          id: 'c5_m1',
          title: 'Module 1: Corporate Memorandums',
          lessons: [
            { id: 'c5_l1', title: 'Lesson 1.1: Minto Pyramid Principles in executive reporting', type: 'video', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', duration: '07:02', completed: false, progressPercent: 0 },
            { id: 'c5_l2', title: 'Lesson 1.2: Reading Material - The Minto Pyramid Principle in Written Memos', type: 'pdf', pdfUrl: '/documents/bus102_pyramid_principle.pdf', duration: '16 min read', completed: false },
            { id: 'c5_l3', title: 'Quiz 1.1: Executive Memos Structure', type: 'quiz', quiz: { id: 'quiz_c5_m1', title: 'Executive Summary Core Principles', questions: [{ id: 'c5_q1', text: "What is the core argument directive of Barbara Minto's Pyramid Principle in executive writing?", options: ["Introduce exhaustive background details before revealing your core conclusion", "State your core answer first, followed immediately by logically grouped supporting arguments", "Write chronologically matching the investigation process", "Omit headings entirely to force the executive to read the complete narrative text"], correctOptionIndex: 1 }, { id: 'c5_q2', text: "Which structural approach ensures that all elements in a supporting group of an executive report are mutually exclusive and collectively exhaustive?", options: ["The SCIP Strategy", "The MECE Framework", "The OKR Checklist", "The SWOT Matrix"], correctOptionIndex: 1 }], timeLimit: 120 } }
          ]
        },
        {
          id: 'c5_m2',
          title: 'Module 2: Boardroom Presentations & Body Language',
          lessons: [
            { id: 'c5_l4', title: 'Lesson 2.1: Slide Deck Design Hierarchy & Visual Storytelling', type: 'video', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4', duration: '10:50', completed: false, progressPercent: 0 },
            { id: 'c5_l5', title: 'Lesson 2.2: Managing Dynamic Voice Pacing and Stage Stances', type: 'pdf', pdfUrl: '/documents/bus102_stage_presence.pdf', duration: '11 min read', completed: false },
            { id: 'c5_l6', title: 'Quiz 2.1: Boardroom Q&A Management', type: 'quiz', quiz: { id: 'quiz_c5_m2', title: 'Boardroom Presentation Evaluator', questions: [{ id: 'c5_q3', text: "Which tactic is ideal when dealing with hostile, unsupportive questions from stakeholders during a board presentation?", options: ["Argue aggressively with facts to show they are wrong", "Acknowledge their concern, reframe the premise productively, and respond objectively using data", "Pretend you did not hear the question and continue to the next slide", "Immediately end the session early to prevent conflicts"], correctOptionIndex: 1 }, { id: 'c5_q4', text: "The 10/20/30 slide presentation guideline created by Guy Kawasaki advises what metrics?", options: ["10 slides, 20 minutes duration, 30pt minimum font size", "10 slides, 20 ideas, 30 columns of details", "10 minutes, 20 slides, 30 illustrations", "10 pages, 20 graphs, 30 seconds per slide"], correctOptionIndex: 0 }], timeLimit: 120 } }
          ]
        },
        {
          id: 'c5_m3',
          title: 'Module 3: Internal Communications & Corporate Synergy',
          lessons: [
            { id: 'c5_l7', title: 'Lesson 3.1: Resolution Tactics for Cross-Department Conflicts', type: 'video', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4', duration: '11:40', completed: false, progressPercent: 0 },
            { id: 'c5_l8', title: 'Lesson 3.2: constructive Feedback Delivery Loops (SBI model)', type: 'pdf', pdfUrl: '/documents/bus102_feedback_loops.pdf', duration: '12 min read', completed: false },
            { id: 'c5_l9', title: 'Quiz 3.1: Professional EQ at Work', type: 'quiz', quiz: { id: 'quiz_c5_m3', title: 'Corporate Synergy Quiz', questions: [{ id: 'c5_q5', text: "What does the SBI constructive feedback delivery model stand for?", options: ["Source, Behavior, Impact", "Situation, Behavior, Impact", "Standard, Blueprint, Improvement", "Scenario, Breakthrough, Implementation"], correctOptionIndex: 1 }], timeLimit: 90 } }
          ]
        },
        {
          id: 'c5_m4',
          title: 'Module 4: Negotiation & Crisis Communications',
          lessons: [
            { id: 'c5_l10', title: 'Lesson 4.1: Principled Negotiation and Best Alternative to Negotiated Agreement (BATNA)', type: 'video', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4', duration: '15:10', completed: false, progressPercent: 0 },
            { id: 'c5_l11', title: 'Lesson 4.2: Writing Crisis PR Statements and Action Plans', type: 'pdf', pdfUrl: '/documents/bus102_crisis_pr.pdf', duration: '22 min read', completed: false },
            { id: 'c5_l12', title: 'Quiz 4.1: Crisis PR and Negotiation Strategies', type: 'quiz', quiz: { id: 'quiz_c5_m4', title: 'Negotiation & Crisis Evaluator', questions: [{ id: 'c5_q6', text: "In crisis communications, what is the major risk of publishing defensive, late, or vague statements?", options: ["Rapid loss of brand equity and public trust", "Increased organic web traffic", "Reduction in PR cost metrics", "Legal class action nullification"], correctOptionIndex: 0 }], timeLimit: 60 } }
          ]
        }
      ]
    },
    {
      id: 'course_quran',
      title: 'Fehm-ul-Quran (Understanding Quran)',
      code: 'ISL101',
      description: 'A study course dedicated to the complete Translation, Tafseer, Context, and Application of Quranic verses for ethical leadership.',
      department: 'Islamic Studies',
      instructor: 'Dr. Tariq Mahmood',
      isPublished: true,
      isQuran: true,
      creditHours: 2,
      prerequisites: ['None'],
      learningOutcomes: [
        'Understand historical preservation of Quranic scriptures.',
        'Extract root Arabic vocabulary meanings for core directives.',
        'Expose lessons from Surah Al-Asr on community preservation.',
        'Adopt tazkiyah (self-purification) and character standards.'
      ],
      durationWeeks: 16,
      modules: [
        {
          id: 'cq_m1',
          title: 'Module 1: Preservation & History of Revelation',
          lessons: [
            { id: 'cq_l1', title: 'Quran Lesson 1.1: Context of Revelation, Makki vs Madani classifications', type: 'video', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', duration: '08:34', completed: false, progressPercent: 0 },
            { id: 'cq_l1_sub', title: 'Quran Lesson 1.2: Reading Material - Comprehensive History of Preservation', type: 'pdf', pdfUrl: '/documents/isl101_preservation_history.pdf', duration: '15 min read', completed: false },
            { id: 'cq_l1_q', title: 'Quiz 1.1: Foundations of Quranic Revelation', type: 'quiz', quiz: { id: 'quiz_quran_m1', title: 'Preservation & Context Evaluation', questions: [{ id: 'q_m1_q1', text: "What is the key distinguishing thematic characteristic of Makki (revealed in Makkah) Surahs?", options: ["Focus on detail-oriented civil laws and transaction rules", "Focus on basic beliefs, oneness of God (Tawheed), and the Hereafter", "Emphasis on international treaty declarations", "Explicit layouts of modern scientific calculations"], correctOptionIndex: 1 }], timeLimit: 120 } }
          ]
        },
        {
          id: 'cq_m2',
          title: 'Module 2: Arabic Vocabulary & Syntax',
          lessons: [
            { id: 'cq_l2', title: 'Quran Lesson 2.1: Semantic root analysis of critical keywords in Surahs', type: 'video', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', duration: '12:00', completed: false, progressPercent: 0 },
            { id: 'cq_l2_sub', title: 'Quran Lesson 2.2: Standard Arabic Root Word Identification Rules', type: 'pdf', pdfUrl: '/documents/isl101_arabic_roots.pdf', duration: '18 min read', completed: false }
          ]
        },
        {
          id: 'cq_m3',
          title: 'Module 3: Analytical Study of Surah Al-Asr',
          lessons: [
            { id: 'cq_l3', title: 'Quran Lesson 3.1: Surah Al-Asr Detailed Exposition', type: 'video', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4', duration: '09:12', completed: false, progressPercent: 0 },
            { id: 'cq_l4', title: 'Quran Lesson 3.2: Reading Material - Tafseer Al-Asr: The Code of Human Success', type: 'pdf', pdfUrl: '/documents/surah_asr_tafseer.pdf', duration: '20 min read', completed: false }
          ]
        },
        {
          id: 'cq_m4',
          title: 'Module 4: Practical Understanding and Code of Conduct',
          lessons: [
            { id: 'cq_l5', title: 'Quran Lesson 4.1: Deriving Legal & Ethical Norms for Communities', type: 'video', videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', duration: '11:15', completed: false, progressPercent: 0 },
            { id: 'cq_l5_sub', title: 'Quran Lesson 4.2: Guidelines for Self-Purification (Tazkiyah)', type: 'pdf', pdfUrl: '/documents/isl101_tazkiyah.pdf', duration: '14 min read', completed: false }
          ]
        },
        {
          id: 'cq_m5',
          title: 'Module 5: Global Assessment & Ethical Certification',
          lessons: [
            { id: 'cq_l6', title: 'Graded Assessment: Comprehension & Practical Application of Quranic Ethics', type: 'quiz', quiz: { id: 'quiz_quran_m5', title: 'Quranic Comprehension Final Evaluator', questions: [{ id: 'q_q1', text: "According to Surah Al-Asr, which four traits guarantee humanity exemption from loss?", options: ["Sincerity, Prayer, Zakat, and Good character", "Belief, Righteous action, Advising truthful conduct, and Mutual patience", "Knowledge, Wealth, Kinship, and Fortitude", "Migration, Supporting distress assistance, Fasting, and Contemplation"], correctOptionIndex: 1 }, { id: 'q_q2', text: "What terminology designates the historical circumstances or contextual occurrences surrounding the revelation of verses?", options: ["Tadabbur", "Asbab al-Nuzul", "Qira'at", "I'jaz al-Quran"], correctOptionIndex: 1 }], timeLimit: 180 } }
          ]
        }
      ]
    }
  ];
}
