import * as d3 from 'd3';
import * as d3Sankey from "d3-sankey";

const width = 928;
const height = 600;
const format = d3.format(",.0f");
const linkColor = "source-target"; // source, target, source-target, or a color string.

// Create a SVG container. - SVG displays content like graphs, charts, and illustrations
const svg = d3.create("svg")
  .attr("width", width)
  .attr("height", height)
  .attr("viewBox", [0, 0, width, height])
  .attr("style", "max-width: 100%; height: auto; font: 10px sans-serif;");

// Constructs and configures a Sankey generator.
const sankey = d3Sankey.sankey()
  .nodeId(d => d.name)
  .nodeAlign(d3Sankey.sankeyJustify) // d3.sankeyLeft, etc.
  .nodeWidth(15)
  .nodePadding(10)
  .extent([[1, 5], [width - 1, height - 5]]);


function forDiagram3(jmuData) {
  const nodes = getNodes(jmuData);
  const links = getLinks(jmuData, nodes);

  return { nodes, links };
}

function getNodes(jmuData) {
  const nodes = [];

  // 1. Get leftmost node: JMU Student
  nodes.push({ name: "JMU Student", title: "JMU Student", category: "student" });

  // 2. Get second-to-leftmost nodes: Fall, Spring
  ["Fall", "Spring"].forEach(semester => {
    nodes.push({ name: semester, title: semester, category: "semester" });
  });

  // 3. Get rightmost nodes: itemized student costs (from "student-costs")
  jmuData["student-costs"].forEach(cost => {
    nodes.push({
      name: cost.name,
      title: `${cost.name} (${cost.semester})`,
      category: "cost"
    });
  });

  return nodes;
}

function getNodesForRevenues(jmuData) {
  const nodes = [];

  // 1. Get Revenue items (from "jmu-revenues")
  jmuData["jmu-revenues"].forEach(rev => {
    nodes.push({
      name: rev.name,
      title: rev.name,
      category: "revenue-item"
    });
  });

  // 2. Get Expense categories
  ["Operating Expenses", "Non-operating Expenses"].forEach(cat => {
    nodes.push({
      name: cat,
      title: cat,
      category: "expense-category"
    });
  });

  return nodes;
}

function getLinks(jmuData, nodes) {
  const links = [];

  // Get the indices of the nodes
  const jmuStudentNode = nodes.find(node => node.name === "JMU Student");
  const fallNode = nodes.find(node => node.name === "Fall");
  const springNode = nodes.find(node => node.name === "Spring");

  // Create links between JMU Student → Fall / Spring
  links.push({ source: jmuStudentNode.name, target: fallNode.name, value: 1 });
  links.push({ source: jmuStudentNode.name, target: springNode.name, value: 1 });

  // Create links between Fall/Spring → itemized costs
  jmuData["student-costs"].forEach(cost => {
    const costNode = nodes.find(node => node.name === cost.name);
    if (cost.semester === "Fall") {
      links.push({ source: fallNode.name, target: costNode.name, value: cost["in-state"] });
    } else {
      links.push({ source: springNode.name, target: costNode.name, value: cost["in-state"] });
    }
  });

  return links;
}

function getExpenseNodes(data) {
  // Generate nodes for expense categories and their items
  const expenseNodes = [];
  data.expenses.forEach(expenseCategory => {
    expenseNodes.push({
      name: expenseCategory.name,
      title: expenseCategory.title || expenseCategory.name
    });

    expenseCategory.items.forEach(item => {
      expenseNodes.push({
        name: item.name,
        title: item.title || item.name
      });
    });
  });
  return expenseNodes;
}

function getLinks(data, nodes) {
  const links = [];

  // Assuming we need to create links between revenue items and expense categories
  data.revenues.forEach(revenueCategory => {
    revenueCategory.items.forEach(item => {
      // Find the revenue node and the corresponding expense node
      const sourceNode = nodes.find(node => node.name === item.name);
      data.expenses.forEach(expenseCategory => {
        expenseCategory.items.forEach(expenseItem => {
          const targetNode = nodes.find(node => node.name === expenseItem.name);

          // Create a link between source and target
          links.push({
            source: sourceNode.name,
            target: targetNode.name,
            value: item.value * expenseItem.value  // Adjust this calculation as necessary
          });
        });
      });
    });
  });

  return links;
}

async function init() {
  const data = await d3.json("data/data_sankey.json");
  const jmuData = await d3.json("data/jmu.json");
  const newData = forDiagram3(jmuData);
  // Applies it to the data. We make a copy of the nodes and links objects
  // so as to avoid mutating the original.
  // dont chang ebelow this for now, change data to something else because this will change to something you can anticipate.
  const { nodes, links } = sankey({
    // const tmp = sankey({
    nodes: data.nodes.map(d => Object.assign({}, d)),
    links: data.links.map(d => Object.assign({}, d))
  });

  // console.log('tmp', tmp);
  console.log('nodes', nodes);
  console.log('links', links);

  // Defines a color scale.
  const color = d3.scaleOrdinal(d3.schemeCategory10);

  // Creates the rects that represent the nodes.
  const rect = svg.append("g")
    .attr("stroke", "#000")
    .selectAll()
    .data(nodes)
    .join("rect")
    .attr("x", d => d.x0)
    .attr("y", d => d.y0)
    .attr("height", d => d.y1 - d.y0)
    .attr("width", d => d.x1 - d.x0)
    .attr("fill", d => color(d.category));

  // Adds a title on the nodes.
  rect.append("title")
    .text(d => {
      console.log('d', d);
      return `${d.name}\n${format(d.value)}`
    });

  // Creates the paths that represent the links.
  const link = svg.append("g")
    .attr("fill", "none")
    .attr("stroke-opacity", 0.5)
    .selectAll()
    .data(links)
    .join("g")
    .style("mix-blend-mode", "multiply");

  // Creates a gradient, if necessary, for the source-target color option.
  if (linkColor === "source-target") {
    const gradient = link.append("linearGradient")
      .attr("id", d => (d.uid = `link-${d.index}`))
      .attr("gradientUnits", "userSpaceOnUse")
      .attr("x1", d => d.source.x1)
      .attr("x2", d => d.target.x0);
    gradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", d => color(d.source.category));
    gradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", d => color(d.target.category));
  }

  link.append("path")
    .attr("d", d3Sankey.sankeyLinkHorizontal())
    .attr("stroke", linkColor === "source-target" ? (d) => `url(#${d.uid})`
      : linkColor === "source" ? (d) => color(d.source.category)
        : linkColor === "target" ? (d) => color(d.target.category)
          : linkColor)
    .attr("stroke-width", d => Math.max(1, d.width));

  link.append("title")
    .text(d => `${d.source.name} → ${d.target.name}\n${format(d.value)}`);

  // Adds labels on the nodes.
  svg.append("g")
    .selectAll()
    .data(nodes)
    .join("text")
    .attr("x", d => d.x0 < width / 2 ? d.x1 + 6 : d.x0 - 6)
    .attr("y", d => (d.y1 + d.y0) / 2)
    .attr("dy", "0.35em")
    .attr("text-anchor", d => d.x0 < width / 2 ? "start" : "end")
    .text(d => d.title);

  // Adds labels on the links.
  svg.append("g")
    .selectAll()
    .data(links)
    .join("text")
    .attr("x", d => {
      console.log('linkd', d)
      const midX = (d.source.x1 + d.target.x0) / 2;
      return midX < width / 2 ? midX + 6 : midX - 6
    })
    .attr("y", d => (d.y1 + d.y0) / 2)
    .attr("dy", "0.35em")
    .attr("text-anchor", d => d.x0 < width / 2 ? "start" : "end")
    .text(d => {
      console.log('linkd', d);
      return `${d.source.title} → ${d.value} → ${d.target.title}`
    });

  const svgNode = svg.node();
  //document.body.appendChild(svgNode);
  document.getElementById("my_dataviz").appendChild(svgNode);
  return svgNode;
}

init();