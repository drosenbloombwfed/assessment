import React from 'react';
import logo from './logo.svg';
import './App.css';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import { withStyles } from '@material-ui/core/styles';
import red  from '@material-ui/core/colors/red';
import blue  from '@material-ui/core/colors/blue';
import yellow  from '@material-ui/core/colors/yellow';

const styles = theme => {
  return {
    listItem: {
      width: '100%'
    },
    root: {
      width: '100%',
      maxWidth: 400,
    },
    avatar: {
      padding: '1rem',
      margin: '1rem',
    },
    'UALARM':{
      background: blue[500],
      padding: '1rem',
      borderRadius: 20
    },
    'AALARM':{
      background: yellow[500],
      padding: '1rem',
      borderRadius: 20
    },
    thingName:{
      background: '#0000005c',
          width: 'fit-content',
          padding: '0 1rem',
    }
  };
};

class App extends React.Component {

  endpoint = 'http://localhost:8000/things';

  listableStates = ['UALARM','AALARM'];

  state = {
    list: [],
    noAlarms: true
  }

  componentDidMount() {
    this.getAlarms();
    setInterval(this.getAlarms, 3000);
  }

  getAlarms = () => {
    fetch(this.endpoint).then(res => res.json()).then(x => this.processAlarms(x));
  }

  processAlarms = (alarms) => {
    const list = alarms.filter(x => this.listableStates.indexOf(x.state) !== -1 ).sort((a, b) => (a.priority < b.priority) ? 1 : -1);
    const noAlarms = list.length === 0;
    this.setState(state => {
      return { list, noAlarms };
    })
    return list;
  }

  getHue = (priority) => {
    const v = (priority - 1) * 100;
    return v >= 0 ? red[v] : red[50];
  }

  render(){
    const { list, noAlarms } = this.state;
    const { classes } = this.props;
    return (
      <div className="App">
        <header className="App-header">
        <div className={classes.root}>
          <List>
              {!noAlarms && list.map((alarm,i) => {
                return (
                  <ListItem className={classes.listItem} key={i}>
                    <ListItemAvatar>
                      <Avatar className={classes.avatar} style={{background: this.getHue(alarm.priority)}} >
                        <h1>{alarm.priority}</h1>
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      className={classes[alarm.state]}
                      primary={<h1 className={classes.thingName}>{alarm.thingName}</h1>}
                      secondary={<h3>{alarm.state}</h3>}
                    />
                  </ListItem>
                )
              })}
              {noAlarms && (
                <h1>No Alarms, Great Job!</h1>
              )}
            </List>
          </div>
        </header>
      </div>
    )
  }
}

export default withStyles(styles)(App);
