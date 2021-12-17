#include <bits/stdc++.h>

using namespace std;

bool check(string s1, string s2)
{
    if (s1.length() != s2.length())
        return false;
    int changes = 0;
    for (int i = 0; i < s1.length(); i++)
    {
        if (s1[i] != s2[i])
            changes++;
    }
    return changes == 1;
}

int minimumSteps(string src, string target, vector<string> words, unordered_map<string, vector<string>> words_map, int ans)
{
    if (src == target)
        return ans;
    for (string s : words_map[target])
    {
        return ans = min(1 + minimumSteps(src, s, words, words_map, ans), ans);
    }
}

int main()
{
    string source = "bit", target = "dog";

    vector<string> words = {"​​bit",
                            "dog",
                            "but",
                            "bot",
                            "put",
                            "big",
                            "pot",
                            "pog",
                            "dog",
                            "lot"};

    unordered_map<string, vector<string>> words_map;

    for (string s : words)
    {
        for (int i = 0; i < words.size(); i++)
        {
            if (s != words[i] && check(s, words[i]))
                words_map[s].push_back(words[i]);
        }
    }

    cout << minimumSteps(source, target, words, words_map, INT_MAX);

    return 0;
}