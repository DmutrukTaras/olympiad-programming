import type { ChapterOutline, PatternOutline } from '@/types/content';

const pattern = (id: string, title: string): PatternOutline => ({ id, title });
const outline = (
  mainPatterns: PatternOutline[],
  additionalTopics: string[] = [],
  optionalTopics: string[] = [],
): ChapterOutline => ({ mainPatterns, additionalTopics, optionalTopics });

// This is the curriculum, not published lesson content. Group related techniques
// here; only split them into individual lessons when the material needs it.
export const chapterOutlines: Record<string, ChapterOutline> = {
  'ch-06': outline([
    pattern('direct-implementation', 'Один прохід по даних'),
    pattern('process-simulation', 'Симуляція процесу'),
    pattern('frequency-counting', 'Частоти та перетворення даних'),
  ]),
  'ch-07': outline([
    pattern('sorting-to-simplify', 'Сортування як спосіб спростити задачу'),
    pattern('custom-sort-order', 'Власний порядок сортування'),
    pattern('basic-stl-structures', 'Вибір структури даних'),
  ]),
  'ch-08': outline(
    [
      pattern('prefix-sum', 'Prefix Sum / Prefix Count'),
      pattern('difference-array', 'Difference Array'),
      pattern('prefix-xor-2d', '2D Prefix'),
    ],
    ['Suffix: інформація праворуч'],
    ['Prefix XOR — extension до Prefix Sum'],
  ),
  'ch-09': outline(
    [
      pattern('parity-remainders', 'Парність, modulo та подільність'),
      pattern('gcd-lcm-primes', 'GCD, LCM та прості числа'),
      pattern('invariants-observations', 'Інваріанти та спостереження'),
    ],
    ['MEX', 'Прості конструктивні математичні задачі'],
    [
      'Contribution Technique — preview',
      'Перебір дільників / факторизація за O(√n)',
      'Binary Exponentiation',
    ],
  ),
  'ch-10': outline([
    pattern('sorted-two-pointers', 'Два вказівники у відсортованих даних'),
    pattern('valid-window', 'Найдовший / найкоротший допустимий відрізок'),
    pattern('frequency-window', 'Sliding Window з частотами'),
  ]),
  'ch-11': outline(
    [
      pattern('binary-search', 'Binary Search'),
      pattern('binary-search-on-answer', 'Binary Search on Answer'),
      pattern('minimax-search', 'Minimize Maximum / Maximize Minimum'),
    ],
    [
      'lower_bound / upper_bound',
      'Пошук першого / останнього допустимого значення',
      'Ternary Search',
    ],
  ),
  'ch-12': outline(
    [
      pattern('sorting-greedy', 'Sorting + Greedy'),
      pattern('interval-greedy', 'Greedy на інтервалах'),
      pattern('constructive-algorithms', 'Constructive Algorithms'),
    ],
    [
      'Greedy + Priority Queue / Set',
      'Exchange argument',
      'Пошук контрприкладів для неправильного greedy',
    ],
  ),
  'ch-13': outline([
    pattern('stack-queue-deque', 'Stack / Queue / Deque'),
    pattern('monotonic-stack', 'Nearest Greater / Smaller і Monotonic Stack'),
    pattern('monotonic-queue', 'Monotonic Queue'),
  ]),
  'ch-14': outline(
    [
      pattern('graph-traversal', 'DFS / BFS / компоненти'),
      pattern('shortest-paths', 'Shortest Paths'),
      pattern('dag-topological-sort', 'DAG / Topological Sort'),
    ],
    [
      'Bipartite Graph',
      'Multi-source BFS',
      '0-1 BFS',
      'Dijkstra',
      'Bellman–Ford',
      'Floyd–Warshall',
      'Cycle Detection',
      'Eulerian Path / Eulerian Cycle',
    ],
  ),
  'ch-15': outline(
    [
      pattern('rooted-tree-euler', 'Rooted Tree / Subtree / Euler Tour'),
      pattern('dsu', 'DSU: компоненти, які змінюються'),
      pattern('minimum-spanning-tree', 'Minimum Spanning Tree'),
    ],
    [
      'Euler Tour',
      'Depth / Parent / Distances',
      'Kruskal',
      'Offline Connectivity',
    ],
  ),
  'ch-16': outline(
    [
      pattern('sequence-dp', 'State / Transition / Sequence DP'),
      pattern('knapsack-counting-dp', 'Knapsack та Counting DP'),
      pattern('multidimensional-dp', 'Grid / String / Tree / DAG DP'),
    ],
    [
      'LIS',
      'Counting DP',
      'Reconstruction',
      'Kadane / Maximum Subarray',
      'DP з кількома параметрами',
    ],
  ),
  'ch-17': outline(
    [
      pattern('fenwick-tree', 'Fenwick Tree'),
      pattern('segment-tree', 'Segment Tree'),
      pattern('offline-processing', 'Offline Processing'),
    ],
    [
      'Coordinate Compression',
      'Lazy Propagation',
      'Sparse Table / RMQ',
      'Sqrt Decomposition',
      'Mo’s Algorithm',
    ],
  ),
  'ch-18': outline(
    [
      pattern('prefix-function-kmp', 'Prefix Function / KMP'),
      pattern('z-function', 'Z-function'),
      pattern('string-hashing', 'String Hashing'),
    ],
    ['Trie', 'Manacher', 'Aho-Corasick', 'Suffix Array'],
    ['Suffix Automaton'],
  ),
  'ch-19': outline(
    [
      pattern('points-vectors-cross', 'Точки, вектори, cross product'),
      pattern('intersections-conditions', 'Segment Intersections'),
      pattern('convex-hull', 'Convex Hull'),
    ],
    [
      'Polygon Area',
      'Sweep Line',
      'Geometry + Sorting',
      'Geometry + Binary Search',
    ],
  ),
  'ch-20': outline(
    [
      pattern('subset-enumeration', 'Subset Enumeration'),
      pattern('bitmask-dp', 'Bitmask DP'),
      pattern('meet-in-the-middle', 'Meet in the Middle'),
    ],
    [
      'Великий n, але малий параметр k',
      'Експоненційний алгоритм лише по малому параметру',
    ],
  ),
  'ch-21': outline(
    [
      pattern(
        'scc-bridges-articulation',
        'SCC / Bridges / Articulation Points',
      ),
      pattern('lca-binary-lifting', 'LCA / Binary Lifting'),
      pattern('rerooting-small-to-large', 'Rerooting / Small-to-Large'),
    ],
    [
      '2-SAT',
      'Heavy-Light Decomposition',
      'Rollback during DFS',
      'Centroid Decomposition',
    ],
  ),
  'ch-22': outline(
    [
      pattern('combinatorics', 'Combinatorics / Inclusion–Exclusion'),
      pattern('expected-value-probability', 'Expected Value / Probability'),
      pattern(
        'advanced-number-theory',
        'Advanced Number Theory / Linear Recurrences',
      ),
    ],
    [
      'Inclusion–Exclusion',
      'Extended Euclid',
      'Linear Diophantine Equations',
      'CRT',
      'Matrix Exponentiation / Linear Recurrences',
      'Gaussian Elimination',
    ],
    ['FFT / NTT', 'Polynomial Algorithms'],
  ),
  'ch-23': outline(
    [
      pattern('bipartite-matching', 'Bipartite Matching'),
      pattern('max-flow-min-cut', 'Maximum Flow / Residual Graph'),
      pattern('flow-reformulation', 'Flow Modeling / Min Cut / Costs'),
    ],
    [
      'Hopcroft–Karp',
      'Vertex Splitting',
      'Min-Cost Max-Flow',
      'Assignment Problem / Hungarian Algorithm',
    ],
  ),
  'ch-24': outline(
    [
      pattern(
        'divide-conquer-optimization',
        'Divide & Conquer DP Optimization',
      ),
      pattern('knuth-optimization', 'Knuth Optimization'),
      pattern('cht-li-chao', 'Convex Hull Trick / Li Chao'),
    ],
    [
      'Lagrangian Relaxation / Aliens Trick',
      'Monotone Queue Optimization',
      'Bitset Optimization',
      'SOS DP',
      'Profile DP',
    ],
  ),
  'ch-25': outline(
    [
      pattern('winning-losing-states', 'Winning / Losing States'),
      pattern('nim-xor', 'Nim / XOR'),
      pattern('sprague-grundy', 'Sprague–Grundy'),
    ],
    [
      'Misère Nim',
      'Games on DAG',
      'Grundy Periodicity',
      'Retrograde Analysis',
      'Симетрія та інваріанти',
    ],
  ),
  'ch-26': outline(
    [
      pattern('state-graph-implicit-graph', 'State Graph / Implicit Graph'),
      pattern(
        'offline-reverse-rollback',
        'Offline / Reverse Process / Rollback',
      ),
      pattern(
        'decomposition-multi-pattern',
        'Decomposition / Multi-Pattern Problems',
      ),
    ],
    [
      'Binary Search + Greedy',
      'Binary Search + DP',
      'DFS + Set + Rollback',
      'Tree + Fenwick / Segment Tree',
      'DP + Data Structure',
      'Geometry + Number Theory',
      'Sorting + Greedy',
      'Prefix + Hashing',
      'Final Mixed Set · без назв патернів і підказок',
    ],
  ),
};
