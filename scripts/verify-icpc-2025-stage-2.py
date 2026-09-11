"""Independent small-instance checks for the 2025 stage 2 editorials.

Run: python scripts/verify-icpc-2025-stage-2.py
No judge submissions or network access are used.
"""
from itertools import product, permutations, combinations
from functools import lru_cache
from collections import deque, Counter
import math
import random

rng = random.Random(20250925)


def office(a):
    dp = [1, 0, 1]
    shifts = (-1, 0, 1)
    for i in range(1, len(a)):
        dp = [min(dp[j] + abs(d) for j, e in enumerate(shifts)
                  if a[i] + d != a[i - 1] + e) for d in shifts]
    return min(dp)


def lighting(matrix):
    for first in range(3):
        cols = [v - first for v in matrix[0]]
        rows = [row[0] - cols[0] for row in matrix]
        if all(0 <= v <= 2 for v in rows + cols) and all(
                rows[i] + cols[j] == value
                for i, row in enumerate(matrix) for j, value in enumerate(row)):
            lamps = ([int(v >= 1) for v in rows], [int(v == 2) for v in rows],
                     [int(v >= 1) for v in cols], [int(v == 2) for v in cols])
            assert all(lamps[0][i] + lamps[1][i] + lamps[2][j] + lamps[3][j] == value
                       for i, row in enumerate(matrix) for j, value in enumerate(row))
            return lamps
    raise AssertionError('valid matrix has no reconstruction')


def melody(a, k):
    answer = 0
    last = conflict = unknown = 0
    key = 0
    for r, value in enumerate(a, 1):
        if value == -1:
            unknown += 1
        else:
            new_key = value - r
            if last and key != new_key:
                conflict = last
            key, last, unknown = new_key, r, 0
        length = min(unknown, k + 1)
        answer += length * (k + 2) - length * (length + 1) // 2
        if last and r + key <= k:
            answer += max(0, last - max(1, conflict + 1, -key) + 1)
    return answer


def melody_brute(a, k):
    return sum(all(a[i] in (-1, start + i - l) for i in range(l, r + 1))
               for l in range(len(a)) for r in range(l, len(a))
               for start in range(max(0, k + 2 - (r - l + 1))))


def medicine(a, x):
    cost = [math.log2(1 + v / x) for v in a]
    dp = [0.] + [math.inf] * (x - 1)
    best = -math.inf
    for v, w in zip(a, cost):
        for s in range(x - 1, -1, -1):
            if s + v >= x:
                best = max(best, math.log2((s + v) / x) - dp[s] - w)
            else:
                dp[s + v] = min(dp[s + v], dp[s] + w)
    return max(0., sum(cost) + best)


def rooms_brute(intervals):
    @lru_cache(None)
    def solve(mask):
        if not mask:
            return True
        bit = mask & -mask
        i = bit.bit_length() - 1
        return any((intervals[i][1] <= intervals[j][0] or
                    intervals[j][1] <= intervals[i][0]) and
                   solve(mask ^ bit ^ (1 << j))
                   for j in range(i + 1, len(intervals)) if mask >> j & 1)
    return solve((1 << len(intervals)) - 1)


def rooms(intervals):
    # Same sweep/range updates as the editorial, with a plain array oracle
    # in place of the lazy segment tree on these tiny coordinate domains.
    coords = sorted({x for pair in intervals for x in pair})
    f = [-sum(l >= r for l, _ in intervals) for r in coords]
    for left in coords:
        for l, r in intervals:
            if l == left:
                for i, right in enumerate(coords):
                    if right <= r:
                        f[i] += 1
            if r == left:
                f = [v - 1 for v in f]
        if any(v > 0 for right, v in zip(coords, f) if right > left):
            return False
    return True


def tournament(g, a):
    active = list(range(len(a)))
    queries = 0
    rank = 1
    while active:
        sink = next((v for v in active if not any(g[v][u] for u in active)), None)
        if sink is not None:
            queries += 1
            if a[sink] == rank:
                active.remove(sink)
                rank += 1
                continue
        candidates = [v for v in active if v != sink]
        for v in candidates:
            queries += 1
            if a[v] == rank:
                u = next(u for u in active if g[v][u])
                return (v, u), queries
        raise AssertionError('minimum must exist')
    return None, queries


def inversion_count(p):
    return sum(p[i] > p[j] for i in range(len(p)) for j in range(i + 1, len(p)))


def cheese_count(n, k, a, b):
    cross2 = a - b + k * (n - k)
    internal2 = a + b - k * (n - k)
    if cross2 % 2 or internal2 % 2 or not 0 <= cross2 <= 2*k*(n-k) or internal2 < 0:
        return 0
    cross, internal = cross2 // 2, internal2 // 2
    if internal > k*(k-1)//2 + (n-k)*(n-k-1)//2:
        return 0
    f = [1] + [0] * cross
    for i in range(1, k + 1):
        shift = n - k + i
        for s in range(cross, shift - 1, -1):
            f[s] -= f[s - shift]
        for s in range(i, cross + 1):
            f[s] += f[s - i]
    g = [1] + [0] * internal
    for size in (k, n - k):
        for i in range(1, size + 1):
            new = []
            window = 0
            for s in range(internal + 1):
                window += g[s]
                if s >= i:
                    window -= g[s - i]
                new.append(window)
            g = new
    return f[cross] * g[internal]


def distances(adj, start, active):
    d = {start: 0}
    queue = deque([start])
    while queue:
        v = queue.popleft()
        for u in adj[v]:
            if u in active and u not in d:
                d[u] = d[v] + 1
                queue.append(u)
    return d


def banks(adj, central, amounts):
    active = set(range(len(adj)))
    depth = distances(adj, central[0], active)
    balance = amounts[:]
    transfers = []
    for x in sorted(active - set(central), key=lambda v: depth[v], reverse=True):
        active.remove(x)
        u = central[0]
        ds = distances(adj, u, active)
        u = max(ds, key=ds.get)
        diameter = max(distances(adj, u, active).values())
        dx = distances(adj, x, active | {x})
        y = next(v for v in active if dx[v] == diameter)
        transfers.append((y, x, balance[x]))
        balance[y] += balance[x]
        balance[x] = 0
    initial = balance[:]
    for y, x, amount in reversed(transfers):
        positive = [v for v, b in enumerate(balance) if b]
        all_d = {v: distances(adj, v, set(range(len(adj)))) for v in positive}
        diameter = max(all_d[v][u] for v in positive for u in positive)
        assert all_d[y][x] == diameter
        assert balance[y] >= amount
        balance[y] -= amount
        balance[x] += amount
    assert balance == amounts
    assert len(transfers) == len(adj) - 2
    return initial


def invariant_graph(n, edges):
    adj = [[] for _ in range(n)]
    for eid, (u, v) in enumerate(edges):
        adj[u].append((v, eid))
        adj[v].append((u, eid))
    tin, parent, parent_edge = [-1]*n, [-1]*n, [-1]*n
    cycles = []
    def dfs(v, pe):
        tin[v] = sum(x >= 0 for x in tin)
        for u, eid in adj[v]:
            if eid == pe:
                continue
            if tin[u] < 0:
                parent[u], parent_edge[u] = v, eid
                dfs(u, eid)
            elif tin[u] < tin[v]:
                cycle = [u]
                x = v
                while x != u:
                    cycle.append(x)
                    x = parent[x]
                cycles.append(cycle)
    dfs(0, -1)
    if -1 in tin:
        return None
    seen = set()
    for cycle in cycles:
        if any(v in seen for v in cycle):
            return False
        seen.update(cycle)
        if any(len(adj[cycle[i]]) != len(adj[cycle[(i+2) % len(cycle)]]) for i in range(len(cycle))):
            return False
    return True


def invariant_brute(n, edges):
    profiles = set()
    for subset in combinations(edges, n-1):
        roots = list(range(n))
        def root(v):
            while roots[v] != v:
                v = roots[v]
            return v
        degree = [0]*n
        for u,v in subset:
            x,y = root(u),root(v)
            if x == y:
                break
            roots[x] = y
            degree[u] += 1
            degree[v] += 1
        else:
            profiles.add(tuple(sorted(degree)))
        if len(profiles) > 1:
            return False
    return bool(profiles)


def penalized(a, penalty):
    # Monotone CHT with exact integer breakpoints and tie: more segments.
    hull = deque([(0, 0, 0, -10**100)])
    total = 0
    for value in a:
        total += value
        while len(hull) > 1 and hull[1][3] <= total:
            hull.popleft()
        m,b,count,_ = hull[0]
        dp, count = total*total + penalty + m*total + b, count+1
        new_m,new_b = -2*total, dp+total*total
        keep = True
        while hull and hull[-1][0] == new_m:
            if (hull[-1][1], -hull[-1][2]) <= (new_b, -count):
                keep = False
                break
            hull.pop()
        if not keep:
            continue
        start = -10**100
        while hull:
            old_m,old_b,old_count,old_start = hull[-1]
            delta,den = new_b-old_b, old_m-new_m
            start = -((-delta)//den) if count >= old_count else delta//den+1
            if start > old_start:
                break
            hull.pop()
        if not hull:
            start = -10**100
        hull.append((new_m,new_b,count,start))
    return dp,count


def bone(a, cuts):
    q = cuts+1
    low,high = 0,sum(a)**2+1
    while low < high:
        mid = (low+high+1)//2
        if penalized(a, mid)[1] >= q:
            low = mid
        else:
            high = mid-1
    cost,_ = penalized(a,low)
    return (sum(a)**2 - (cost-low*q))//2


def run():
    for n in range(1,6):
        good = [b for b in product(range(-1,4),repeat=n)
                if all(b[i] != b[i+1] for i in range(n-1))]
        for a in product(range(3),repeat=n):
            brute = min(sum(abs(x-y) for x,y in zip(a,b)) for b in good)
            assert office(a) == brute
    print('A: exhaustive arrays length <= 5 vs all good target arrays in [-1,3]', flush=True)
    for n in range(1,7):
        for a in product(range(-1,3),repeat=n):
            assert melody(a,2) == melody_brute(a,2), a
    print('B: all melodies length <= 6 over {-1,0,1,2}', flush=True)
    for n in range(1,8):
        for _ in range(200):
            c = [rng.randrange(10) for _ in range(n)]
            j = (c.index(min(c))-1)%n
            a = [c[i]-c[(i+1)%n]+(min(c) if i==j else 0) for i in range(n)]
            assert [max([0]+[sum((a[i:]+a[:i])[:t]) for t in range(1,n+1)]) for i in range(n)] == c
            x = rng.randrange(1,10)
            pills = [rng.randrange(1,10) for _ in range(n)]
            base = sum(math.log2(1+v/x) for v in pills)
            brute = max([0.]+[base+math.log2(sum(pills[i] for i in range(n) if mask>>i&1)/x)-sum(math.log2(1+pills[i]/x) for i in range(n) if mask>>i&1) for mask in range(1,1<<n) if sum(pills[i] for i in range(n) if mask>>i&1)>=x])
            assert abs(medicine(pills,x)-brute)<1e-9
    print('C/D: 1400 constructions and subset optimizations', flush=True)
    for n in range(1,6):
        pairs=list(combinations(range(n),2))
        for mask in range(1<<len(pairs)):
            g=[[False]*n for _ in range(n)]
            for i,(u,v) in enumerate(pairs):
                g[u][v]=bool(mask>>i&1)
                g[v][u]=not g[u][v]
            for a in permutations(range(1,n+1)):
                result,queries=tournament(g,a)
                assert queries<=n
                assert (result is not None)==any(g[u][v] and a[u]<a[v] for u,v in permutations(range(n),2))
                if result is not None:
                    u,v=result
                    assert g[u][v] and a[u]<a[v]
    print('E: every tournament and hidden permutation for n <= 5', flush=True)
    intervals=list(combinations(range(5),2))
    for n in range(1,6):
        for _ in range(1000):
            sample=rng.choices(intervals,k=2*n)
            assert rooms(sample)==rooms_brute(sample),sample
    print('F: 5000 interval matchings against subset recursion', flush=True)
    for n in range(2,8):
        for k in range(1,n):
            counts=Counter((inversion_count(p),inversion_count(p[k:]+p[:k])) for p in permutations(range(n)))
            for a in range(n*(n-1)//2+1):
                for b in range(n*(n-1)//2+1):
                    assert cheese_count(n,k,a,b)==counts[a,b],(n,k,a,b)
    print('G: all permutations n <= 7 and all feasible/infeasible count pairs', flush=True)
    for n in range(2,35):
        for _ in range(50):
            adj=[[] for _ in range(n)]
            edges=[]
            for v in range(1,n):
                u=rng.randrange(v)
                adj[u].append(v)
                adj[v].append(u)
                edges.append((u,v))
            banks(adj,rng.choice(edges),[rng.randrange(1,100) for _ in range(n)])
    print('H: 1650 trees, every transfer and final balance simulated', flush=True)
    for n in range(2,7):
        possible=list(combinations(range(n),2))
        masks=range(1<<len(possible)) if n<=5 else [rng.randrange(1<<len(possible)) for _ in range(3000)]
        for mask in masks:
            edges=[edge for i,edge in enumerate(possible) if mask>>i&1]
            predicted=invariant_graph(n,edges)
            if predicted is not None:
                assert predicted==invariant_brute(n,edges),(n,edges)
    print('J: all graphs n <= 5 and 3000 six-vertex graphs vs all spanning trees', flush=True)
    for n in range(2,10):
        for _ in range(300):
            a=[rng.randrange(6) for _ in range(n)]
            for cuts in range(1,n):
                brute=min(sum(sum(a[l:r])**2 for l,r in zip((0,)+split,split+(n,))) for split in combinations(range(1,n),cuts))
                assert bone(a,cuts)==(sum(a)**2-brute)//2,(a,cuts)
            for penalty in range(20):
                dp=[(0,0)]
                for i in range(1,n+1):
                    dp.append(min((dp[j][0]+sum(a[j:i])**2+penalty,dp[j][1]-1) for j in range(i)))
                value,count=penalized(a,penalty)
                assert (value,-count)==dp[-1],(a,penalty)
    print('K: 2400 arrays, all cut counts + exact CHT/DP ties', flush=True)
    for n in range(1,4):
        for m in range(1,4):
            for row in product(range(3),repeat=n):
                for col in product(range(3),repeat=m):
                    lighting([[x+y for y in col] for x in row])
    print('L: every row/column contribution vector for dimensions <= 3', flush=True)


if __name__ == '__main__':
    run()
