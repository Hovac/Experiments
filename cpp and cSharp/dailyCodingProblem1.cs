using System;
using System.Collections.Generic;

namespace dailyCodingProblem1
{
    class Program
    {
        
        static int Main(string[] args)
        {
            bool flagged = false;
            List<int> nums = new List<int>();
            Console.WriteLine("input a target number");
            int.TryParse(Console.ReadLine(), out int target);

            InputNumbers(ref nums);
            nums.RemoveAt(nums.Count-1);

            foreach(var number in nums) {
                if (target - number > 0)
                {
                    flagged = nums.Contains(target - number);
                }
            }

            if (flagged == true) Console.WriteLine("there is number that adds up to target number");
            else Console.WriteLine("There is no number to add to target");

            return 0;
        }

        static List<int> InputNumbers(ref List<int> nums)
        {
            Console.WriteLine("Write numbers to add to the list, then write 'stop' to end");
            bool checkState = true;
            while (checkState)
            {
                string line = Console.ReadLine();

                if (line == "stop")
                {
                    checkState = false;
                }

                if (!(int.TryParse(line, out int value) || line == "stop"))
                {
                    Console.WriteLine("Please enter a valid number!");
                    continue;
                }

                nums.Add(value);


            }
            return nums;
        }
    }
}
