// dailyProblem1.cpp

//Given a list of numbers, and a number k, return whether any two numbers from the list add up to k.
//For example, given [10, 15, 3, 7] and k = 17, return true since 10+7 is 17.

#include <iostream>
#include <list>
using namespace std;


int main()
{
	list<int> numbers = { 11, 10, 2, 5, 6, 50, -30, 60 };
	int target = 30;
	
	bool flag = false;




	for (auto itc = numbers.begin(); itc != numbers.end(); ++itc) {
		for (auto itp = numbers.begin(); itp != numbers.end(); ++itp) {
			cout << *itc << " " << *itp << endl;
			if (*itc + *itp == target) flag = true;
		}
	}

	cout << flag << endl;

	return 0;
}