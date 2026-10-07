import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'

function App() {

  const [frequency, setFrequency] = useState("Yearly")
  const [amount, setAmount] = useState(0)
  const [rate, setRate] = useState(0)
  const [years, setYears] = useState(0)
  const [regDepWith, setRegDepWith] = useState("")
  const [regFrequency, setRegFrequency] = useState("Yearly")
  const [regAmount, setRegAmount] = useState(0)
  const [regIncreaseType, setRegIncreaseType] = useState("%")
  const [regIncrease, setRegIncrease] = useState(0)
  const [clickedCalc, setClickedCalc] = useState(false)
  
  const [table, setTable] = useState([])

  const freqMap = {
    Yearly: 1,
    Monthly: 12,
    Weekly: 52,
    Daily: 365
  }

  const startCalculation = () => {
    setClickedCalc(true)
    console.log("")
    console.log("Amount - ", amount)
    console.log("Rate - ", rate)
    console.log("Frequency - ", frequency)
    console.log("Years - ", years)
    console.log("Reg Dep/With - ", regDepWith)
    console.log("Reg Frequency - ", regFrequency)
    console.log("Reg Increase Type - ", regIncreaseType)
    console.log("Reg Increase - ", regIncrease)

    // Format is [year, totalDeposits, accInterest, balance]
    let tempTable = []
    setTable(tempTable)

    let totalDeposits = Number(amount)
    let tDepositsWithdraws = Number(amount)
    let balance = Number(amount)
    let accInterest = 0
    let addDeposits = 0
    let trueRate = Number(rate)

    if (frequency !== "Yearly") {
      let tempRate = (trueRate / freqMap[frequency] / 100) + 1
      let returnRate = tempRate
      for (let i = 1; i < freqMap[frequency]; i++) {
        returnRate = returnRate * tempRate
      }
      trueRate = (returnRate - 1) * 100
    }

    if (regDepWith === 'Deposit') {
      addDeposits += Number(regAmount) * freqMap[regFrequency]
    }
    if (regDepWith === 'Withdraw') {
      addDeposits -= Number(regAmount) * freqMap[regFrequency]
    }


    for (let i = 0; i <= years; i++) {
      if (i === 0) {
        tempTable.push([i, tDepositsWithdraws.toFixed(2), totalDeposits.toFixed(2), accInterest.toFixed(2), balance.toFixed(2)])
      } else {
        totalDeposits += addDeposits
        balance += balance * (trueRate / 100) + addDeposits // Might need to account for overall interval?? idk
        accInterest = balance - totalDeposits
        tDepositsWithdraws = addDeposits
        tempTable.push([i, tDepositsWithdraws.toFixed(2), totalDeposits.toFixed(2), accInterest.toFixed(2), balance.toFixed(2)])

        if (regIncrease > 0) {
          if (regIncreaseType === "$") {
            addDeposits += Number(regIncrease)
          }
          if (regIncreaseType === "%") {
            addDeposits += addDeposits * Number(regIncrease) / 100
          }
        }
      }
  
    }
    setTable(tempTable)
  }

  let USDollar = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  return (
    <section className="compoundCalculator">
      <h2>Compound Interest Calculator</h2>
        <section className="basicInfo">

          <h3>Starting Capital</h3>
          <input
          type="number"
          value={amount}
          min="0"
          onChange={(e) => setAmount(e.target.value)}
          />

          <h3>Interest Rate</h3>
          <input
          type="number"
          value={rate}
          min="0"
          onChange={(e) => setRate(e.target.value)}
          />

          <h3>Compound Frequency</h3>
          <select
          value={frequency}
          onChange={(e) => setFrequency(e.target.value)}
          >
          {Object.keys(freqMap).map((freq) => (
            <option key={freq}>{freq}</option>
          ))}
          </select>

          <h3>Years</h3>
          <input
          type="number"
          min="0"
          value={years}
          onChange={(e) => setYears(e.target.value)}
          />

        </section>

        <section className="regularChanges">

          <h4>Regular Deposits/Withdraws</h4>
          <label>
            <input 
              type="radio" 
              value=""
              checked={regDepWith === ''} 
              onChange={(e) => setRegDepWith(e.target.value)}
            /> None</label>
          <label>
            <input 
              type="radio" 
              value="Deposit"
              checked={regDepWith === 'Deposit'} 
              onChange={(e) => setRegDepWith(e.target.value)}
            /> Deposits</label>
          <label>
            <input 
              type="radio" 
              value="Withdraw"
              checked={regDepWith === 'Withdraw'} 
              onChange={(e) => setRegDepWith(e.target.value)}
            /> Withdraws</label>


          {regDepWith !== '' && (
            <div className="regularRules">
              <h4 id="needaBeBlack">Regular {regDepWith} Frequency</h4>
              <select
              value={regFrequency}
              onChange={(e) => setRegFrequency(e.target.value)}
              >
              {Object.keys(freqMap).map((freq) => (
                <option key={freq}>{freq}</option>
              ))}
              </select>

              <h4 id="needaBeBlack">{regDepWith} Amount</h4>
              <input
              type="number"
              value={regAmount}
              onChange={(e) => setRegAmount(e.target.value)}
              />

              <h4 id="needaBeBlack">Regular {regDepWith} Increase</h4>

              <label  id="needaBeBlack">
                <input 
                type="radio" 
                value="%"
                checked={regIncreaseType === '%'} 
                onChange={(e) => setRegIncreaseType(e.target.value)}
              /> % </label>
              <label  id="needaBeBlack">
                <input 
                type="radio" 
                value="$"
                checked={regIncreaseType === '$'} 
                onChange={(e) => setRegIncreaseType(e.target.value)}
              /> $ </label >

              <input
              type="number"
              value={regIncrease}
              onChange={(e) => setRegIncrease(e.target.value)}
              />
            </div>
          )}
        </section>

        <button 
        type="button"
        onClick={startCalculation}
        >Calculate</button>

        <section className="results">
          {clickedCalc && (
            <div>

              <section className="topLineData">
                <h5>Final Value: {USDollar.format(table[table.length -1][4])}</h5>
              </section>

              <table>
                <tr>
                  <th>Year</th>
                  <th>Deposits/Withdraws</th>
                  <th>Total Deposits</th>
                  <th>Acc Interest</th>
                  <th>Balance</th>
                </tr>
                {table.map((row) =>  (
                  <tr key={row[0]}>
                    <td>{row[0]}</td>
                    <td>{USDollar.format(row[1])}</td>
                    <td>{USDollar.format(row[2])}</td>
                    <td>{USDollar.format(row[3])}</td>
                    <td>{USDollar.format(row[4])}</td>
                  </tr>
                ))}
              </table>
            </div>
          )}
        </section>
    </section>
      
  )
}

export default App
