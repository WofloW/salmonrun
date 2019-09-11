import React, {useEffect, useState} from 'react'
import './App.css'
import maps from './maps.json'
import weapons from './weapons'
import _ from 'lodash'
import moment from 'moment'
import 'moment/locale/zh-cn'
import axios from 'axios'

moment.locale('zh-cn')

function App() {
  const [rotation, setRotation] = useState({})
  useEffect(() => {
    axios.get('https://files.oatmealdome.me/bcat/coop.json')
      .then((res) => {
        setRotation(res.data)
      })
      .catch((err) => {
        console.error(err)
      })
  }, [])

  return (
    <div className="App">
      <h3>Splatoon 2 Salmon Run rotation</h3>
      <h3>乌贼2打工时间表</h3>
      <div style={{fontSize: 12, marginBottom:10}}>夜风制作 打工qq群: 138151784</div>
      {/*<img src={logo} className="App-logo" alt="logo" />*/}
      {
        _.map(rotation.Phases, (phase) => {
          const start = moment(phase.StartDateTime+'+00:00')
          const end = moment(phase.EndDateTime+'+00:00')

          if (end.isAfter(moment())) {
            let remaining = null
            if (start.isBefore(moment())) {
              const diff = end.diff(moment())
              const duration = moment.duration(diff)
              remaining = <div>{`距离结束：${duration.hours()}小时${duration.minutes()}分钟`}</div>
            }
            return <div key={phase.StartDateTime} className='card'>
              {remaining}
              <div>
                开始时间：{start.format('lll')}
              </div>
              <div style={{marginBottom: 20}}>
                结束时间：{end.format('lll')}
              </div>
              <div>
                {/*<div>{phase.StageID}</div>*/}
                <div><img style={{width: '100%'}}
                          src={`https://leanny.github.io/stages/${_.find(maps, {Id: phase.StageID}).MapFileName}.png`}/>
                </div>
              </div>
              <div style={{textAlign: 'center'}}>
                <div style={{maxWidth: 625, display: 'inline-block'}}>
                  {
                    _.map(phase.WeaponSets, (weapon, index) => {
                      let weaponName
                      if (_.find(weapons, {Id: weapon})) {
                        weaponName = `Wst_${_.find(weapons, {Id: weapon}).Name}`
                      } else if (weapon === -1) {
                        weaponName = 'questionmark'
                      } else {
                        weaponName = 'questionmark2'
                      }
                      return <div key={index} style={{display: 'inline-block', width: '25%'}}>
                        <img style={{width: '90%'}} src={`https://leanny.github.io/splat2/weapons/${weaponName}.png`}/>
                      </div>
                    })
                  }
                </div>
              </div>
              {
                _.includes(phase.WeaponSets, -1) &&
                <img
                  src={`https://leanny.github.io/splat2/weapons/Wst_${_.find(weapons, {Id: phase.RareWeaponID}).Name}.png`}/>
              }

            </div>
          } else {
            return null
          }
        })
      }

    </div>
  )
}

export default App
