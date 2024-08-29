export const disputeResolutionNodes = {
  start: {
    handler: 'intro'
  },

  intro: {
    text: `CONGRATULATIONS! You've qualified for an exciting money-making opportunity. Don't miss out on this once in a lifetime opportunity. Do you want to know what it is? Then stay on the line and you will soon have more money than you know what to do with. All I ask is for 12 seconds of your time, and all of your financial worries will be gone. But first, let me introduce myself. Hi, my name is Vince Slickson, and I used to be like you. Down on my luck. Debt piling up. Trapped in a boring life that I did not know how to get out of. It felt like there was no escape. Like the walls were closing in on me and I was running out of time. I was prevented from living the existence I truly wanted, and it was all due to the arbitrary number in my bank account. I wished there was a magic wand that I could wave to replace that pathetically small number with a big fat bold number that I could be proud of. One day I found that magic wand, and I would like to share it with you. Are you ready to hear the one investment secret that wealth generation professionals don't want you to know about? Well here it is. The key to financial freedom. This is the one thing you need to turn your luck around and start making fat stacks of cash. Just one simple thing that most people would kill to know about. Are you listening? Here is what I want you to do. Pick up your phone, open the App Market, type in Money Miner, and press that big fat Download button. Money Miner is the next generation of wealth creation technology, and it all rests on top of a secure decentralized block chain network. Now I know what you're thinking. Block chain technology is complicated and hard to understand. But don't worry. Money Miner makes it dead simple to get rich quick. All you need to do is set up an account and start mining crypto currency. It's so simple that even a financial novice can do it. You'll be raking it in in no time. Financial insiders know that crypto currency is the wave of the future, and that it has the potential to help millions of individual investors finally escape financial bondage and achieve the financial freedom they've always dreamed about. This is the opportunity you've been looking for. Your ticket to living the life you deserve. So download Money Miner today and accomplish your financial dreams today.,`,
    async follow() {
      await waitPromise(20000)
      return
    },
    handler: 'oneMoment'
  },

  oneMoment: {
    text: 'One moment please. ',
    async follow() {
      await waitPromise(4000)
      return 'intro'
    }
  }

}