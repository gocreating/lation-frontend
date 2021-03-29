import { useEffect, useState } from 'react'
import Badge from 'react-bootstrap/Badge'
import Container from 'react-bootstrap/Container'
import Image from 'react-bootstrap/Image'
import Jumbotron from 'react-bootstrap/Jumbotron'
import AppLayout from '../components/AppLayout'
import Spinner from '../components/Spinner'
import { withTranslation } from '../i18n'
import { API_HOST } from '../utils/config'

const HomePage = ({ t }) => {
  const [words, setWords] = useState([])
  const [showWordFreqency, setShowWordFrequency] = useState(false)
  useEffect(async () => {
    const res = await fetch(`${API_HOST}/ptt/latest-push-content-cut-words?board=Stock&search=盤中閒聊`)
    const rawWords = await res.json()
    const wordCount = {}
    rawWords.forEach(rawWord => {
      if (wordCount[rawWord] === undefined) {
        wordCount[rawWord] = 0
      }
      wordCount[rawWord] += 1
    })
    let wordPairs = []
    for (let word in wordCount) {
      wordPairs.push([word, wordCount[word]])
    }
    wordPairs.sort((a, b) => b[1] - a[1])
    setWords(wordPairs.filter(([word, frequency]) => (word.length < 20 && frequency > 2)))
    setShowWordFrequency(true)
  }, [])
  return (
    <AppLayout title={t('home.title')} titleSuffix={false} noContainer>
      <Jumbotron>
        <Container>
          <p>{t('home.description')}</p>
        </Container>
      </Jumbotron>
      <Container>
        <Image src={`${API_HOST}/static/latest-push-content-cut-words.png`} rounded fluid />
        {showWordFreqency ? (
          <p style={{ marginTop: '2rem' }}>
            {words.map((word, i) => (
              <Badge pill variant="light" key={`${i}-${word[0]}`}>
                {`${word[0]} (${word[1]})`}
              </Badge>
            ))}
          </p>
        ) : <Spinner />}
      </Container>
    </AppLayout>
  )
}

HomePage.getInitialProps = async () => ({
  namespacesRequired: ['common'],
})

export default withTranslation('common')(HomePage)
