import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { motion, AnimatePresence } from 'framer-motion';
import { useThreadGraphD3 } from '../../hooks/useThreadGraph';

interface ThreadGraphNode {
  id: string;
  name: string;
  subject: string;
  progress_status: 'completed' | 'current' | 'upcoming';
  x?: number;
  y?: number;
  fx?: number;
  fy?: number;
}

interface ThreadGraphEdge {
  source: string | ThreadGraphNode;
  target: string | ThreadGraphNode;
  relationship_type: 'prerequisite' | 'bridge' | 'branch';
  strength: number;
}


interface ThreadGraphProps {
  threadId: string;
  isVisible: boolean;
  position: { x: number; y: number };
  onClose: () => void;
}

const SUBJECT_COLORS = {
  Math: '#FF6B6B',
  Science: '#4ECDC4', 
  Literature: '#45B7D1',
  History: '#96CEB4',
  Arts: '#FFEAA7',
  Language: '#DDA0DD',
  default: '#95A5A6'
};

const ThreadGraph: React.FC<ThreadGraphProps> = ({ 
  threadId, 
  isVisible, 
  position, 
  onClose 
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions] = useState({ width: 500, height: 400 });
  
  const { data: graphData, isLoading, error } = useThreadGraphD3(threadId, isVisible);

  useEffect(() => {
    if (!isVisible || !graphData || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous render

    const { width, height } = dimensions;

    // Create force simulation
    const simulation = d3.forceSimulation<ThreadGraphNode>(graphData.nodes)
      .force('link', d3.forceLink<ThreadGraphNode, ThreadGraphEdge>(graphData.edges)
        .id(d => d.id)
        .distance(d => 80 / (d.strength || 1))
      )
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(25));

    // Create links
    const links = svg.append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(graphData.edges)
      .enter()
      .append('line')
      .attr('stroke', (d: any) => {
        switch (d.relationship_type) {
          case 'prerequisite': return '#3498db';
          case 'bridge': return '#e74c3c';
          case 'branch': return '#f39c12';
          default: return '#95a5a6';
        }
      })
      .attr('stroke-width', (d: any) => Math.sqrt(d.strength * 5))
      .attr('stroke-opacity', 0.6);

    // Create nodes
    const nodes = svg.append('g')
      .attr('class', 'nodes')
      .selectAll('g')
      .data(graphData.nodes)
      .enter()
      .append('g')
      .attr('class', 'node')
      .call(d3.drag<SVGGElement, ThreadGraphNode>()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended) as any
      );

    // Add circles to nodes
    nodes.append('circle')
      .attr('r', (d: any) => d.progress_status === 'current' ? 15 : 12)
      .attr('fill', (d: any) => SUBJECT_COLORS[d.subject as keyof typeof SUBJECT_COLORS] || SUBJECT_COLORS.default)
      .attr('stroke', (d: any) => {
        switch (d.progress_status) {
          case 'completed': return '#27ae60';
          case 'current': return '#f39c12';
          case 'upcoming': return '#95a5a6';
          default: return '#bdc3c7';
        }
      })
      .attr('stroke-width', 3)
      .attr('opacity', (d: any) => d.progress_status === 'upcoming' ? 0.6 : 1);

    // Add labels to nodes
    nodes.append('text')
      .text((d: any) => d.name.length > 15 ? d.name.substring(0, 15) + '...' : d.name)
      .attr('text-anchor', 'middle')
      .attr('dy', 4)
      .attr('font-size', '10px')
      .attr('font-weight', 'bold')
      .attr('fill', '#2c3e50')
      .attr('pointer-events', 'none');

    // Add tooltips
    const tooltip = d3.select('body').append('div')
      .attr('class', 'thread-graph-tooltip')
      .style('position', 'absolute')
      .style('background', 'rgba(0, 0, 0, 0.8)')
      .style('color', 'white')
      .style('padding', '8px')
      .style('border-radius', '4px')
      .style('font-size', '12px')
      .style('opacity', 0)
      .style('pointer-events', 'none')
      .style('z-index', 1000);

    nodes.on('mouseover', (event: any, d: any) => {
      tooltip.transition().duration(200).style('opacity', 1);
      tooltip.html(`
        <strong>${d.name}</strong><br/>
        Subject: ${d.subject}<br/>
        Status: ${d.progress_status}
      `)
      .style('left', (event.pageX + 10) + 'px')
      .style('top', (event.pageY - 10) + 'px');
    })
    .on('mouseout', () => {
      tooltip.transition().duration(200).style('opacity', 0);
    });

    // Update positions on tick
    simulation.on('tick', () => {
      links
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      nodes.attr('transform', (d: any) => `translate(${d.x},${d.y})`);
    });

    // Drag functions
    function dragstarted(event: d3.D3DragEvent<SVGGElement, ThreadGraphNode, ThreadGraphNode>) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: d3.D3DragEvent<SVGGElement, ThreadGraphNode, ThreadGraphNode>) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: d3.D3DragEvent<SVGGElement, ThreadGraphNode, ThreadGraphNode>) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = undefined;
      event.subject.fy = undefined;
    }

    // Cleanup on unmount
    return () => {
      tooltip.remove();
      simulation.stop();
    };
  }, [graphData, isVisible, dimensions]);

  if (error) {
    return (
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="fixed z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-4"
            style={{
              left: Math.min(position.x, window.innerWidth - 300),
              top: Math.min(position.y, window.innerHeight - 200),
              width: '280px',
              height: '120px'
            }}
          >
            <div className="text-red-600 text-sm">
              <p className="font-semibold">ThreadGraph Error</p>
              <p>Unable to load thread visualization</p>
            </div>
            <button 
              onClick={onClose}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed z-50 bg-white border border-gray-200 rounded-lg shadow-xl"
          style={{
            left: Math.min(position.x, window.innerWidth - dimensions.width - 40),
            top: Math.min(position.y, window.innerHeight - dimensions.height - 80),
            width: dimensions.width + 40,
            height: dimensions.height + 80
          }}
        >
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800">Thread Visualization</h3>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Graph Content */}
          <div className="p-4">
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-600">Loading thread graph...</span>
              </div>
            ) : (
              <div className="relative">
                <svg
                  ref={svgRef}
                  width={dimensions.width}
                  height={dimensions.height}
                  className="border border-gray-100 rounded"
                />
                
                {/* Legend */}
                <div className="absolute bottom-2 right-2 bg-white bg-opacity-90 p-2 rounded text-xs">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-3 h-0.5 bg-blue-500"></div>
                    <span>Prerequisite</span>
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-3 h-0.5 bg-red-500"></div>
                    <span>Bridge</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-0.5 bg-orange-500"></div>
                    <span>Branch</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer with metadata */}
          {graphData && 'metadata' in graphData && graphData.metadata && (
            <div className="px-4 pb-4 text-xs text-gray-500">
              {graphData.metadata.crossSubjectBridges?.length > 0 && (
                <p>🌉 {graphData.metadata.crossSubjectBridges.length} cross-subject bridges</p>
              )}
              {graphData.metadata.branchingOpportunities?.length > 0 && (
                <p>🌿 {graphData.metadata.branchingOpportunities.length} branching opportunities</p>
              )}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ThreadGraph;