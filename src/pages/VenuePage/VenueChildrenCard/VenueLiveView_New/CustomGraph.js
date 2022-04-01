import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Graph from 'graphology';
import circular from 'graphology-layout/circular';
import { useSigma, useRegisterEvents, useLoadGraph, useSetSettings } from 'react-sigma-v2';
import forceAtlas2 from 'graphology-layout-forceatlas2';

const propTypes = {
  data: PropTypes.instanceOf(Object).isRequired,
};

const CustomGraph = ({ data }) => {
  const sigma = useSigma();
  const registerEvents = useRegisterEvents();
  const loadGraph = useLoadGraph();
  const setSettings = useSetSettings();
  const [hoveredNode, setHoveredNode] = useState({
    hoverNode: undefined,
    hoverNeighbours: undefined,
  });

  useEffect(() => {
    const graph = new Graph();

    // Create all nodes
    data.nodes.forEach((node) => {
      graph.addNode(node.id, {
        nodeType: 'company',
        label: node.name,
        size: node.size,
        color: '#335996',
      });
    });

    // Create all edges
    data.edges.forEach((edge) => {
      graph.addEdge(edge.from, edge.to, {
        weight: edge.weight,
        type: 'arrow',
        size: 5,
        label: `${edge.weight}%`,
      });
    });

    circular.assign(graph, { center: 1 });
    const settings = forceAtlas2.inferSettings(graph);
    forceAtlas2.assign(graph, { settings, iterations: 600 });
    loadGraph(graph);
  }, [loadGraph, data]);

  useEffect(() => {
    // Register Sigma events
    registerEvents({
      enterNode: ({ node }) => {
        setHoveredNode({
          hoverNode: node,
          hoverNeighbours: data.edges
            .filter((edge) => edge.from === node || edge.to === node)
            .map((edge) => {
              const idToGet = edge.from === node ? edge.to : edge.from;
              return data.nodes.find((x) => x.id === idToGet)?.id ?? '';
            }),
        });
      },
      leaveNode: () => {
        setHoveredNode({
          hoverNode: undefined,
          hoverNeighbours: undefined,
        });
      },
      clickNode: () => console.log('test'),
    });
  }, [sigma, registerEvents, data]);

  useEffect(() => {
    setSettings({
      nodeReducer: (node, d) => {
        const newData = { ...d };
        if (
          hoveredNode.hoverNeighbours &&
          !hoveredNode.hoverNeighbours.includes(node) &&
          hoveredNode.hoverNode !== node
        ) {
          newData.label = '';
          newData.color = '#f6f6f6';
        }
        return newData;
      },
      edgeReducer: (edge, d) => {
        const graph = sigma.getGraph();
        const newData = { ...d, hidden: false };
        if (hoveredNode.hoverNode && !graph.hasExtremity(edge, hoveredNode.hoverNode)) {
          newData.hidden = true;
        }
        return newData;
      },
    });
  }, [sigma, setSettings, hoveredNode]);

  return null;
};

CustomGraph.propTypes = propTypes;
export default CustomGraph;
