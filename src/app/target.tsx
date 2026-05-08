import { useState } from 'react'
import { Alert, View } from 'react-native'

import { Button } from '@/components/Button'
import { CurrencyInput } from '@/components/CurrencyInput'
import { Input } from '@/components/Input'
import { PageHeader } from '@/components/PageHeader'

import { useTargetDatabase } from '@/src/database/useTargetDatabase'

export default function Target() {
  const [name, setName] = useState('')
  const [amount, setAmount] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)

  const targetDatabase = useTargetDatabase()

  async function handleSave() {
    try {
      // validação
      if (!name.trim()) {
        return Alert.alert(
          'Atenção',
          'Informe o nome da meta.'
        )
      }

      if (amount <= 0) {
        return Alert.alert(
          'Atenção',
          'O valor precisa ser maior que zero.'
        )
      }

      setIsProcessing(true)

      // salva no SQLite
      await targetDatabase.create({
        name,
        amount,
      })

      Alert.alert(
        'Sucesso',
        'Meta criada com sucesso!'
      )

      // limpa formulário
      setName('')
      setAmount(0)
    } catch (error) {
      console.log(error)

      Alert.alert(
        'Erro',
        'Não foi possível salvar a meta.'
      )
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <View style={{ flex: 1, padding: 24 }}>
      <PageHeader
        title="Meta"
        subtitle="Economize para alcançar sua meta financeira."
      />

      <View style={{ marginTop: 32, gap: 24 }}>
        <Input
          label="Nova meta"
          placeholder="Ex: Viagem para praia, Apple Watch"
          value={name}
          onChangeText={setName}
        />

        <CurrencyInput
          label="Valor alvo (R$)"
          value={amount}
          onChangeValue={setAmount}
        />

        <Button
          title={isProcessing ? 'Salvando...' : 'Salvar'}
          onPress={handleSave}
        />
      </View>
    </View>
  )
}