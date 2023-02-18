import '@testing-library/jest-dom'
import predicateConverter from '../backend/PredicateConverter'

/**
 * This class tests the predicate conversion to make sure the
 * resulting graph object is created correctly.
 * 
 * @author Noah Alexander ngalexa2
 */

test ("predicate with just nodes with basic information", () => {
    let predicate = {
        node: {
          1: {x:3, y:2},
          2: {x:1, y:2},
          3: {x:4, y:2}
        }
      };

    let expectedGraphData = [
        {data: {id:'1', marked:false, label:'', highlighted:false, weight:null, color:'black'}, position: {x:3, y:2}},
        {data: {id:'2', marked:false, label:'', highlighted:false, weight:null, color:'black'}, position: {x:1, y:2}},
        {data: {id:'3', marked:false, label:'', highlighted:false, weight:null, color:'black'}, position: {x:4, y:2}}
    ]
    
    let graphData = predicateConverter(predicate);

    expect(expectedGraphData).toEqual(graphData);
});

test ("predicate with just nodes with some expected information", () => {
    let predicate = {
        node: {
          1: {x:3, y:2, label:'one'},
          2: {x:1, y:2, weight:3},
          3: {x:4, y:2, label:'three'}
        }
      };

    let expectedGraphData = [
        {data: {id:'1', marked:false, label:'one', highlighted:false, weight:null, color:'black'}, position: {x:3, y:2}},
        {data: {id:'2', marked:false, label:'', highlighted:false, weight:3, color:'black'}, position: {x:1, y:2}},
        {data: {id:'3', marked:false, label:'three', highlighted:false, weight:null, color:'black'}, position: {x:4, y:2}}
    ]
    
    let graphData = predicateConverter(predicate);

    expect(expectedGraphData).toEqual(graphData);
});

test ("predicate with just nodes with all expected information", () => {
    let predicate = {
        node: {
          1: {x:3, y:2, label:'one', marked:false, highlighted:false, weight:3, color:'red'},
          2: {x:1, y:2, label:'two', marked:true, highlighted:false, weight:1, color:'black'},
          3: {x:4, y:2, label:'three', marked:false, highlighted:true, weight:0, color:'white'} 
        }
      };

    let expectedGraphData = [
        {data: {id:'1', marked:false, label:'one', highlighted:false, weight:3, color:'red'}, position: {x:3, y:2}},
        {data: {id:'2', marked:true, label:'two', highlighted:false, weight:1, color:'black'}, position: {x:1, y:2}},
        {data: {id:'3', marked:false, label:'three', highlighted:true, weight:0, color:'white'}, position: {x:4, y:2}}
    ]
    
    let graphData = predicateConverter(predicate);

    expect(expectedGraphData).toEqual(graphData);
});

test ("predicate with just nodes with all expected information with extra key:value pairs", () => {
    let predicate = {
        node: {
          1: {x:3, y:2, label:'one', marked:false, highlighted:false, weight:3, color:'red', border:'dashed'},
          2: {x:1, y:2, label:'two', marked:true, highlighted:false, weight:1, color:'black'},
          3: {x:4, y:2, label:'three', marked:false, highlighted:true, weight:0, color:'white'} 
        }
      };

    let expectedGraphData = [
        {data: {id:'1', marked:false, label:'one', highlighted:false, weight:3, color:'red', border:'dashed'}, position: {x:3, y:2}},
        {data: {id:'2', marked:true, label:'two', highlighted:false, weight:1, color:'black'}, position: {x:1, y:2}},
        {data: {id:'3', marked:false, label:'three', highlighted:true, weight:0, color:'white'}, position: {x:4, y:2}}
    ]
    
    let graphData = predicateConverter(predicate);

    expect(expectedGraphData).toEqual(graphData);
});

test ("predicate with nodes and undirected edges with some expected information", () => {
    let predicate = {
        node: {
          1: {x:3, y:2, label:'one', marked:false, highlighted:false, weight:3, color:'red'},
          2: {x:1, y:2, label:'two', marked:true, highlighted:false, weight:1, color:'black'},
          3: {x:4, y:2, label:'three', marked:false, highlighted:true, weight:0, color:'white'} 
        },
        undirected: {
            4: {source:1, destination:2},
            5: {source:2, destination:3, weight:4},
            6: {source:3, destination:1}
        }
      };

    let expectedGraphData = [
        {data: {id:'1', marked:false, label:'one', highlighted:false, weight:3, color:'red'}, position: {x:3, y:2}},
        {data: {id:'2', marked:true, label:'two', highlighted:false, weight:1, color:'black'}, position: {x:1, y:2}},
        {data: {id:'3', marked:false, label:'three', highlighted:true, weight:0, color:'white'}, position: {x:4, y:2}},
        {data: {id:'4', label:'', source:1, destination: 2}},
        {data: {id:'5', label:'4', source:2, destination:3}},
        {data: {id:'6', label:'', source:3, destination:1}}
    ]
    
    let graphData = predicateConverter(predicate);

    expect(expectedGraphData).toEqual(graphData);
});

test ("predicate with nodes and undirected edges with all expected information", () => {
    let predicate = {
        node: {
          1: {x:3, y:2, label:'one', marked:false, highlighted:false, weight:3, color:'red'},
          2: {x:1, y:2, label:'two', marked:true, highlighted:false, weight:1, color:'black'},
          3: {x:4, y:2, label:'three', marked:false, highlighted:true, weight:0, color:'white'} 
        },
        undirected: {
            4: {source:1, destination:2, weight:2, label:'four'},
            5: {source:2, destination:3, weight:4, label:'five'},
            6: {source:3, destination:1, weight:1, label:'six'}
        }
      };

    let expectedGraphData = [
        {data: {id:'1', marked:false, label:'one', highlighted:false, weight:3, color:'red'}, position: {x:3, y:2}},
        {data: {id:'2', marked:true, label:'two', highlighted:false, weight:1, color:'black'}, position: {x:1, y:2}},
        {data: {id:'3', marked:false, label:'three', highlighted:true, weight:0, color:'white'}, position: {x:4, y:2}},
        {data: {id:'4', label: "2\nfour", source: 1, destination: 2}},
        {data: {id:'5', label: "4\nfive", source: 2, destination: 3}},
        {data: {id:'6', label: "1\nsix", source: 3, destination: 1}}
    ]
    
    let graphData = predicateConverter(predicate);

    expect(expectedGraphData).toEqual(graphData);
});

test ("predicate with nodes and directed edges with some expected information", () => {
    let predicate = {
        node: {
          1: {x:3, y:2, label:'one', marked:false, highlighted:false, weight:3, color:'red'},
          2: {x:1, y:2, label:'two', marked:true, highlighted:false, weight:1, color:'black'},
          3: {x:4, y:2, label:'three', marked:false, highlighted:true, weight:0, color:'white'} 
        },
        directed: {
            4: {source:1, destination:2},
            5: {source:2, destination:3, weight:4},
            6: {source:3, destination:1}
        }
      };

    let expectedGraphData = [
        {data: {id:'1', marked:false, label:'one', highlighted:false, weight:3, color:'red'}, position: {x:3, y:2}},
        {data: {id:'2', marked:true, label:'two', highlighted:false, weight:1, color:'black'}, position: {x:1, y:2}},
        {data: {id:'3', marked:false, label:'three', highlighted:true, weight:0, color:'white'}, position: {x:4, y:2}},
        {data: {id:'4', label:'', source:1, destination: 2}, classes: ['directed']},
        {data: {id:'5', label:'4', source:2, destination:3}, classes: ['directed']},
        {data: {id:'6', label:'', source:3, destination:1}, classes: ['directed']}
    ]
    
    let graphData = predicateConverter(predicate);

    expect(expectedGraphData).toEqual(graphData);
});

test ("predicate with nodes and directed edges with all expected information", () => {
  let predicate = {
      node: {
        1: {x:3, y:2, label:'one', marked:false, highlighted:false, weight:3, color:'red'},
        2: {x:1, y:2, label:'two', marked:true, highlighted:false, weight:1, color:'black'},
        3: {x:4, y:2, label:'three', marked:false, highlighted:true, weight:0, color:'white'} 
      },
      directed: {
          4: {source:1, destination:2, weight:2, label:'four'},
          5: {source:2, destination:3, weight:4, label:'five'},
          6: {source:3, destination:1, weight:1, label:'six'}
      }
    };

  let expectedGraphData = [
      {data: {id:'1', marked:false, label:'one', highlighted:false, weight:3, color:'red'}, position: {x:3, y:2}},
      {data: {id:'2', marked:true, label:'two', highlighted:false, weight:1, color:'black'}, position: {x:1, y:2}},
      {data: {id:'3', marked:false, label:'three', highlighted:true, weight:0, color:'white'}, position: {x:4, y:2}},
      {data: {id:'4', label: "2\nfour", source: 1, destination: 2}, classes: ['directed']},
      {data: {id:'5', label: "4\nfive", source: 2, destination: 3}, classes: ['directed']},
      {data: {id:'6', label: "1\nsix", source: 3, destination: 1}, classes: ['directed']}
  ]
  
  let graphData = predicateConverter(predicate);

  expect(expectedGraphData).toEqual(graphData);
});

test ("predicate with just nothing inside it", () => {
  let predicate = {};

  let expectedGraphData = [];
  
  let graphData = predicateConverter(predicate);

  expect(expectedGraphData).toEqual(graphData);
});

test ("predicate with nodes but empty directed and undirected edges", () => {
  let predicate = {
    node: {
      1: {x:3, y:2},
      2: {x:1, y:2},
      3: {x:4, y:2}
    },
    directed: {}
  };

  let expectedGraphData = [
    {data: {id:'1', marked:false, label:'', highlighted:false, weight:null, color:'black'}, position: {x:3, y:2}},
    {data: {id:'2', marked:false, label:'', highlighted:false, weight:null, color:'black'}, position: {x:1, y:2}},
    {data: {id:'3', marked:false, label:'', highlighted:false, weight:null, color:'black'}, position: {x:4, y:2}}
  ];
  
  let graphData = predicateConverter(predicate);

  expect(expectedGraphData).toEqual(graphData);

  //now make a predicate with undirected being empty
  predicate = {
    node: {
      1: {x:3, y:2},
      2: {x:1, y:2},
      3: {x:4, y:2}
    },
    undirected: {}
  };

  graphData = predicateConverter(predicate);

  expect(expectedGraphData).toEqual(graphData);

  //now make predicate with both undirected and directed being empty

  predicate = {
    node: {
      1: {x:3, y:2},
      2: {x:1, y:2},
      3: {x:4, y:2}
    },
    undirected: {},
    directed: {}
  };

  graphData = predicateConverter(predicate);

  expect(expectedGraphData).toEqual(graphData);
});