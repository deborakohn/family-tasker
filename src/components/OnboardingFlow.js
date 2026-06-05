import React from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function OnboardingFlow({
  screen,
  setScreen,
  adminName,
  setAdminName,
  groupName,
  setGroupName,
  joinCode,
  setJoinCode,
  memberName,
  setMemberName,
  handleCreateGroup,
  handleJoinOrLoginGroup,
}) {
  if (screen === 'dashboard') {
    return null;
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
      {screen === 'welcome' && (
        <View style={styles.heroWrap}>
          <View style={styles.appNameWrap}>
            <Text style={styles.appNameShadow}>FamSync</Text>
            <Text style={styles.appName}>FamSync</Text>
          </View>
          <Text style={styles.kicker}>Organização sem complicação</Text>
          <View style={styles.heroCard}>
            <Text style={styles.title}>Sua casa organizada e agenda da sua família em perfeita sintonia.</Text>
            <Text style={styles.subtitle}>
              Crie uma rotina mais leve, acompanhe tarefas e calendário, e convide sua família com poucos toques.
            </Text>
            <View style={styles.buttonGroup}>
              <TouchableOpacity style={styles.primaryButton} onPress={() => setScreen('setup-admin')}>
                <Text style={styles.primaryButtonTitle}>Começar minha família</Text>
                <Text style={styles.primaryButtonSubtitle}>Sou o administrador do grupo</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.secondaryButton} onPress={() => setScreen('setup-member')}>
                <Text style={styles.secondaryButtonTitle}>Já tenho um código</Text>
                <Text style={styles.secondaryButtonSubtitle}>Entrar em uma família existente</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {screen === 'setup-admin' && (
        <View style={styles.heroWrap}>
          <View style={styles.appNameWrap}>
            <Text style={styles.appNameShadow}>FamSync</Text>
            <Text style={styles.appName}>FamSync</Text>
          </View>
          <Text style={styles.kicker}>Organização sem complicação</Text>
          <View style={styles.card}>
            <Text style={styles.title}>Vamos criar sua família</Text>
            <Text style={styles.subtitle}>Preencha seu nome e o nome do grupo para começar.</Text>
            <TextInput style={styles.input} placeholder="Seu Nome..." value={adminName} onChangeText={setAdminName} />
            <TextInput style={styles.input} placeholder="Nome do Grupo/Família..." value={groupName} onChangeText={setGroupName} />
            <TouchableOpacity style={styles.btnSuccess} onPress={handleCreateGroup}><Text style={styles.btnText}>Criar grupo e entrar</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => setScreen('welcome')} style={styles.backButton}><Text style={styles.linkText}>Voltar</Text></TouchableOpacity>
          </View>
        </View>
      )}

      {screen === 'setup-member' && (
        <View style={styles.heroWrap}>
          <View style={styles.appNameWrap}>
            <Text style={styles.appNameShadow}>FamSync</Text>
            <Text style={styles.appName}>FamSync</Text>
          </View>
          <Text style={styles.kicker}>Organização sem complicação</Text>
          <View style={styles.card}>
            <Text style={styles.title}>Entrar em uma família</Text>
            <Text style={styles.subtitle}>Use o código compartilhado pelo administrador e informe seu nome.</Text>
            <TextInput style={styles.input} placeholder="Código do Grupo (Ex: GRP1234)..." value={joinCode} onChangeText={setJoinCode} autoCapitalize="characters" />
            <TextInput style={styles.input} placeholder="Seu Nome..." value={memberName} onChangeText={setMemberName} />
            <TouchableOpacity style={[styles.btnSuccess, styles.joinButton]} onPress={handleJoinOrLoginGroup}><Text style={styles.btnText}>Entrar no grupo</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => setScreen('welcome')} style={styles.backButton}><Text style={styles.linkText}>Voltar</Text></TouchableOpacity>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 24, backgroundColor: '#eef6ff' },
  heroWrap: { width: '100%', alignItems: 'center' },
  appNameWrap: { marginBottom: 6, alignItems: 'center', justifyContent: 'center', minHeight: 62 },
  appNameShadow: { position: 'absolute', top: 4, left: 4, fontSize: 54, fontWeight: '900', color: '#60a5fa', textAlign: 'center', letterSpacing: 0.2 },
  heroCard: { width: '90%', backgroundColor: '#ffffff', padding: 24, borderRadius: 28, shadowColor: '#0f172a', shadowOpacity: 0.08, shadowRadius: 24, shadowOffset: { width: 0, height: 12 }, elevation: 4 },
  appName: { fontSize: 54, fontWeight: '900', color: '#3b82f6', textAlign: 'center', letterSpacing: 0.2, textShadowColor: '#dbeafe', textShadowOffset: { width: 2, height: 2 }, textShadowRadius: 0 },
  kicker: { fontSize: 12, fontWeight: '800', color: '#4f46e5', textAlign: 'center', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 100 },
  card: { width: '90%', backgroundColor: '#fff', padding: 24, borderRadius: 28, shadowColor: '#0f172a', shadowOpacity: 0.08, shadowRadius: 24, shadowOffset: { width: 0, height: 12 }, elevation: 4, marginTop: 6 },
  title: { fontSize: 27, fontWeight: '950', color: '#0f172a', textAlign: 'center', marginBottom: 10, lineHeight: 34 },
  subtitle: { fontSize: 14, color: '#64748b', textAlign: 'center', marginBottom: 22, lineHeight: 21 },
  input: { backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 14, padding: 14, fontSize: 15, marginBottom: 12, color: '#0f172a' },
  buttonGroup: { gap: 12, marginTop: 6 },
  primaryButton: { backgroundColor: '#4f46e5', paddingVertical: 16, paddingHorizontal: 16, borderRadius: 18, alignItems: 'center' },
  secondaryButton: { backgroundColor: '#eef2ff', paddingVertical: 16, paddingHorizontal: 16, borderRadius: 18, alignItems: 'center', borderWidth: 1, borderColor: '#c7d2fe' },
  primaryButtonTitle: { color: '#fff', fontWeight: '900', fontSize: 16, marginBottom: 2, textAlign: 'center' },
  primaryButtonSubtitle: { color: 'rgba(255,255,255,0.9)', fontSize: 12, fontWeight: '600', textAlign: 'center' },
  secondaryButtonTitle: { color: '#3730a3', fontWeight: '900', fontSize: 16, marginBottom: 2, textAlign: 'center' },
  secondaryButtonSubtitle: { color: '#4f46e5', fontSize: 12, fontWeight: '600', textAlign: 'center' },
  btnSuccess: { backgroundColor: '#4f46e5', padding: 16, borderRadius: 16, alignItems: 'center', marginTop: 8 },
  joinButton: { backgroundColor: '#4f46e5' },
  btnText: { color: '#fff', fontWeight: '900', fontSize: 15 },
  linkText: { color: '#4f46e5', textAlign: 'center', fontSize: 14, fontWeight: '600' },
  backButton: { marginTop: 18 },
  stepBadge: { alignSelf: 'center', backgroundColor: '#eef2ff', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 999, marginBottom: 12 },
  stepBadgeText: { color: '#4f46e5', fontSize: 11, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 0.6 },
});