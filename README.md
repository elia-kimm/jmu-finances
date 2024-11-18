# Goal

Let's learn more about our institution while learning more about javascript and interactive information visualization (a.k.a. "infovis" or "dataviz").

# Plan
## Get your own copy of the code and run it
1. Fork this repository
1. Clone your fork

## Getting started with an npm project

Note: this not about using 3p code in your own app (final project)

1. come to have the code (e.g. clone repo, as in preceding section)
1. open a terminal in that directory (i.e. the one that has the `package.json` file), you will know this worked because you will see the `package.json` file when you run `ls` or `dir`
1. run `npm i` (or `npm install` to install the dependencies listed in the `package.json` file)
1. you're ready to roll, so in the case of this project which is built with vite, you could now do like `npm run dev`

## What does the starter code do?
1. Go to the URL listed in the output of the previous step (e.g. http://localhost:5173/ )
1. What do you see?
1. Review the `index.html` and `main.js` files to see what they're doing
    * Notice that `main.js`:
        1. loads the `d3` library: https://d3js.org/what-is-d3
        1. fetches some json data from `data/data_sankey.json`
            * take a look at this file: 
                1. what javascript data structures are used in this file?
                1. what general data structure (for those of you have taken Data Structures) might best represent the data that is in this file?
        1. uses the `d3-sankey` library to create a sankey diagram

## Make a Sankey using our own data

We will make 4 Sankey diagrams (more details follow) using data from JMU which you can find in the `data` directory.
1. Inspect the `data/jmu.json` file
    * What javascript structure(s) is(are) used in this file?
    * how does the structure of the data in this file compare to the structure of the data in `data/data_sankey.json`?
1. Create the new sankey diagram per specs below.

### 🤠 Data Wranglin' 
1. When working conducting data analysis, including infovis, it is often necessary to wrangle the data into a format that is more amenable to the task at hand.
    * often this just means in to a format expected by our own existing code, our (or third-party, a.k.a. "3p") libraries, tools, apps, etc.
1. In this case, we will need to wrangle the data in `data/jmu.json` into a format that is expected by the `d3-sankey` library.
1. In `main.js` edit the code where the current json data is loaded to instead load the correct data file, and before proceeding to the next parts of the code, construct data in the format expected by the `d3-sankey` library. This is outlined further in the Recommended Process below.

![Sankey Diagram](finances.jpg)

Working in groups of 4 or fewer members, each group member should work on at least 1 diagram from those that follow. **Note: it is ok if you cannot coordinate with 3 others to have 1 diagram/member, but you/your group will be responsible for all 3 regardless of how many members you have. The diagrams are as follows:

### Sankey 1: JMU Student Costs
1. leftmost node: JMU Student
1. second-to-leftmost nodes: Fall, Spring
1. rightmost nodes: the `student itemized` costs from the `student-costs`

### Sankey 2: JMU Student Auxiliary Comprehensive Fee
1. leftmost node: Auxiliary Comprehensive Fee (or "Comprehensive Fee")
1. rightmost nodes: the `Auxiliary Comprehensive Fee Component` costs from the `student-costs`

### Sankey 3: JMU Revenues
1. leftmost nodes: JMU (positive) Revenue items (all items with `category` of `income`)
1. second-to-leftmost nodes: JMU Revenue Categories (e.g. operating revenues, non-operating revenues, etc.), the set of unique `type` values from the items in the preceding column
1. center node: JMU 
1. second-to-rightmost nodes: JMU Expense (negative revenue) Categories (e.g. operating expenses), the set of unique `type` values from the items in the following column
1. rightmost nodes: JMU Expense items (e.g. Instruction, Research, etc.) (all items with the `category` of `expense`)

### Sankey 4: JMU Athletics Revenues

1. leftmost nodes: football, men's basketball, women's basketball, other sports, non-program specific
1. second-to-leftmost nodes: JMU Athletics (positive) Revenue items (e.g. Ticket sales, etc.)
1. center node: JMU Athletics
1. second-to-rightmost nodes: JMU Athletics Expense categories (negative revenue) (e.g. Athletic student aid, etc.)
1. rightmost nodes: football, men's basketball, women's basketball, other sports, non-program specific


# Recommended Process

For each of the diagrams listed above, the goal is to end up with a Sankey diagram that shows visualizes of JMU's financial data, rather than the contrived data. While it can be interested to dive into d3 and the `d3-sankey` library, I recommend something simpler for now.

## Don't become a d3 or d3-sankey expert just yet

You could try (reading the d3-sankey docs, or source code or) experimenting with removing certain attributed from the starting data file to see how the different properties affect the diagram, but to save a little time, let me tell you the following:
1. the data in the example file is a single object with 2 keys: `nodes` and `links`
1. the `nodes` key is an array of objects, each with:
    1. a `name` key that should be unique among all nodes
    1. a `title` key which is currently used in the diagram to label the node
1. the `links` key is an array of objects, each with:
    1. a `source` key that specifies that this link begins at the `node` with `name` equal to the value of the this `link`'s `source` key
    1. a `target` key that specifies that this link begins at the `node` with `name` equal to the value of the this `link`'s `target` key
    1. a `value` key that specifies the "weight" (i.e. width, value) of the link

# Sketch it out
On a whiteboard, paper (napkin?!), or a chalkboard if you must 😏, sketch what you understand from the specs about your diagram

1. How many columns of nodes does the spec for your diagram define?
    1. draw a column of 2 nodes for each of the columns in the spec
1. What does the spec say about what the nodes in each column will be?
    1. write a label for the title of each of your nodes in each of your columns. Base the label on the spec and the dataset.
1. draw a link between at least 1 node int eh first column and at least 1 node in the second column
    1. based on the preceding steps and the spec, what do you think the value of this link should be? add that value to your sketch


## Implementing the Wranglin'

1. Find the place in `main.js` where the data is loaded.
    * it reads `const data = await d3.json("data/data_sankey.json");`
1. Duplicate this line, immediately after the original line, in the second (the duplicate) line, change the variable name (but none of the subsequent references in the file) to something else, e.g. `jmuData` and change the file it's loading to be the one with the JMU data.
1. Comment out the first one
1. Immediately after the new line fetching your data, declare a variable names `data` and set it to the result of a function that you will write that will transform the data from the JMU data file into the format expected by the `d3-sankey` library. You might name this function `forDiagram3` (if you are working on diagram 3)
    * e.g. `const data = forDiagram3(jmuData);`
1. Declare the function `forDiagram3` that will transform the data from the JMU data file into the format expected by the `d3-sankey` library. This function should:
    1. return an object with `nodes` and `links` keys, each of which should have an array of objects as their value.
    1. The `nodes` array should have an object for each node in the diagram
    1. The `links` array should have an object for each link in the diagram. 
    1. The `nodes` objects should have at least `name` and `title` keys
    1. The `links` objects should have at least `source`, `target`, and `value` keys.
1. since the tasks above are so many, decompose the problem further, and where necessary, do a little work to simplify the next functions' work. consider:
    ```javascript
    function forDiagram3(jmuData) {
      // this is the data for all the diagrams, but this funciton is only about some of that data...
      const relevantData = // FIXME: how can you assign only the values from the releveant key of jmuData here?
      const nodes = getNodes(jmuData);
      const links = getLinks(jmuData);
      return { nodes, links };
    }
    ```
1. Declare the functions `getNodes` and `getLinks` that will transform the data from the JMU data file into the format expected by the `d3-sankey` library. These functions should:
    1. return an array of objects
    1. The objects should have at least `name` and `title` keys for `getNodes` and `source`, `target`, and `value` keys for `getLinks`.
### Nodes
1. as the specs say different ways about how to get the nodes for different columns, you might want to further decompose this problem by having a function for each column of nodes, e.g. `getNodesCol1` (or instead of `Col` you could use the semantic meaning of that column), `getNodesCol2`, etc.
    * this reduces the responsibilities of the `getNodes` function to just calling these other functions and combining their results
1. at this point of problem decomposition, you have reduced the responsibility of (e.g.) getNodesCol1 to returning a list of nodes for only the first column, all of the nodes for a column are defined as being created using the same pieces of the dataset

### Links
1. depending on how many columns you have, there may be different rules for constructing the links in the diagram. the rules should be the same for links between the same two columns, but will likely differ for links between other columns. 
    * **Note: since the links should use actual, existing node `name`s for their `source` and `target` values, you may want to pass the list of nodes created in getNodes as a second parameter to `getLinks`**
1. as the specs say different ways about how to get the links for different column-pairs, you might want to further decompose this problem by having a function for each pair of columns of nodes (unless your diagram has only 2 columns), e.g. `getLinksCol1Col2` (or instead of `Col` you could use the semantic meaning of that column), etc.
    * this reduces the responsibilities of the `getLinks` function to just calling these other functions and combining their results
1. at this point of problem decomposition, you have reduced the responsibility of (e.g.) `getLinksCol1Col2` to returning a list of links for only the links between the first and second columns, all of the links for a column are defined as being created using the same pieces of the dataset

# References

## Topics
1. https://d3-graph-gallery.com/graph/sankey_basic.html
1. https://github.com/d3/d3-sankey
1. https://observablehq.com/@d3/sankey/2
1. https://observablehq.com/@d3/sankey-component

## Data
1. [Undergraduate student estimated annual costs](https://www.jmu.edu/ubo/tuition-and-fees/examples.shtml#undefined)
1. [University Financials](https://dlas-directus-prod.azurewebsites.net/assets/D483491A-F567-42B7-B936-17D1ACF64E9A.pdf)
1. [JMU Athletics Financials](https://dlas-directus-prod.azurewebsites.net/assets/F1F30B26-FCE4-45EE-9222-50D42E8A5C7A.pdf)
1. [(Auxiliary) Comprehensive Fee breakdown](https://www.jmu.edu/ubo/student-accounts/rates-breakdown.shtml)
1. [The Breeze -- Over $900 for debt, $444 for UREC: Exclusive breakdown of student fees](https://www.breezejmu.org/news/over-900-for-debt-444-for-urec-exclusive-breakdown-of-student-fees/article_b98cc294-0f44-11ef-a311-c75b454e3750.html)
    * [Auxiliary Comprehensive Fee Expenditure Breakdown for FY 24](https://bloximages.newyork1.vip.townnews.com/breezejmu.org/content/tncms/assets/v3/editorial/b/a5/ba5940ac-0f4a-11ef-aa66-eb7bb38401ee/663eed2533491.pdf.pdf)

# Acknowledgements
1. https://www.data-to-viz.com/
