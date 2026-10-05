import React, { useState, useEffect, useRef } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet, Modal, Animated, BackHandler, Platform } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

// ---- Design tokens (8pt grid) ----
const C = { navy: '#1a2447', blue: '#2e5ce6', blueD: '#2449c4', green: '#4a9b3f', ink: '#111827', mut: '#4b5563', line: '#e5e7eb', bg: '#f6f8fb', tint: '#eaf0ff', ok: '#e3f4e0', okD: '#2f6f27' };
const font = (w = '400') => ({ fontWeight: w, fontFamily: Platform.select({ ios: 'System', android: 'sans-serif', default: 'Inter, system-ui, sans-serif' }) });

const INITIAL = [
  { id: '1', m: 'Doctor Visit', a: '$100.00', d: 'September 14, 2026' },
  { id: '2', m: 'Pharmacy', a: '$45.50', d: 'August 30, 2026' },
  { id: '3', m: 'Dental Care', a: '$120.00', d: 'August 12, 2026' },
];

// ---- Shared components ----
const Btn = ({ label, onPress, variant = 'primary', icon }) => (
  <Pressable accessibilityRole="button" onPress={onPress}
    style={({ pressed }) => [s.btn, variant === 'primary' && { backgroundColor: pressed ? C.blueD : C.blue }, variant === 'secondary' && { borderWidth: 1.5, borderColor: C.blue, backgroundColor: '#fff' }]}>
    {icon && <Ionicons name={icon} size={20} color={variant === 'primary' ? '#fff' : C.blue} />}
    <Text style={[s.btnT, { color: variant === 'primary' ? '#fff' : variant === 'secondary' ? C.blue : C.mut }]}>{label}</Text>
  </Pressable>
);

const Header = ({ title, onBack }) => {
  const { top } = useSafeAreaInsets();
  return (
    <View style={[s.bar, { paddingTop: top + 8 }]}>
      {onBack ? (
        <Pressable accessibilityLabel="Back" accessibilityRole="button" onPress={onBack} style={s.ib}><Ionicons name="chevron-back" size={26} color={C.ink} /></Pressable>
      ) : <View style={{ width: 8 }} />}
      <Text accessibilityRole="header" style={s.barT}>{title}</Text>
    </View>
  );
};

const Row = ({ icon, title, sub, onPress, right }) => (
  <Pressable accessibilityRole={onPress ? 'button' : undefined} onPress={onPress} style={s.row}>
    <View style={s.chip}><Ionicons name={icon} size={22} color={C.blue} /></View>
    <View style={{ flex: 1 }}><Text style={s.rowT}>{title}</Text>{!!sub && <Text style={s.rowS}>{sub}</Text>}</View>
    {right || (onPress && <Ionicons name="chevron-forward" size={20} color="#6b7280" />)}
  </Pressable>
);

const BottomNav = ({ active, go, soon }) => {
  const { bottom } = useSafeAreaInsets();
  const Item = ({ icon, label, on, press }) => (
    <Pressable accessibilityRole="tab" accessibilityLabel={label} onPress={press} style={s.navI}>
      <Ionicons name={icon} size={26} color={on ? C.blue : C.ink} />
      <Text style={[s.navT, on && { color: C.blue }]}>{label}</Text>
    </Pressable>
  );
  return (
    <View style={[s.nav, { paddingBottom: bottom + 8 }]}>
      <Item icon="home-outline" label="Home" on={active === 'home'} press={() => go('home')} />
      <Item icon="wallet-outline" label="Accounts" press={soon} />
      <Pressable accessibilityLabel="Use My Money" onPress={soon} style={[s.navI, { marginTop: -28 }]}>
        <View style={s.fab}><Ionicons name="cash-outline" size={28} color="#fff" /></View>
        <Text style={s.navT}>Use My Money</Text>
      </Pressable>
      <Item icon="card-outline" label="Cards" press={soon} />
      <Item icon="grid-outline" label="More" on={active === 'more'} press={() => go('more')} />
    </View>
  );
};

const ReceiptPaper = () => (
  <View style={s.paper}>
    <Text style={[s.pl, { textAlign: 'center', fontWeight: '700', fontSize: 11 }]}>DOCTOR'S OFFICE</Text>
    <View style={s.pr}><Text style={s.pl}>09/28/2026</Text><Text style={s.pl}>10:42</Text></View>
    <View style={s.dash} />
    <View style={s.pr}><Text style={s.pl}>Office visit</Text><Text style={s.pl}>85.00</Text></View>
    <View style={s.pr}><Text style={s.pl}>Lab fee</Text><Text style={s.pl}>15.00</Text></View>
    <View style={s.dash} />
    <View style={s.pr}><Text style={[s.pl, { fontWeight: '700' }]}>TOTAL</Text><Text style={[s.pl, { fontWeight: '700' }]}>$100.00</Text></View>
    <View style={s.pr}><Text style={s.pl}>VISA ••4417</Text><Text style={s.pl}>PAID</Text></View>
  </View>
);

// ---- Screens ----
const Home = ({ soon }) => {
  const { top } = useSafeAreaInsets();
  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 24 }}>
      <View style={[s.hero, { paddingTop: top + 24 }]}>
        <View style={s.top}>
          <Text style={s.logo}>ele<Text style={{ color: '#4ade80' }}>v</Text>ate</Text>
          <View style={s.avatar}><Text style={{ color: '#fff', ...font('600') }}>O</Text></View>
        </View>
        <View style={[s.card, { padding: 16 }]}>
          <View style={s.acct}>
            <Ionicons name="hand-left-outline" size={36} color={C.green} />
            <Text style={[s.acctN, { flex: 1 }]}>Health Savings Account</Text>
            <Text style={s.acctV}>$9,999.99</Text>
          </View>
          <Pressable onPress={soon} style={s.invest}>
            <Ionicons name="trending-up" size={32} color={C.green} />
            <View style={{ flex: 1 }}><Text style={{ ...font('700'), fontSize: 16, color: C.ink }}>Investments</Text><Text style={s.rowS}>You can now start investing!</Text></View>
            <Ionicons name="chevron-forward" size={20} color={C.ink} />
          </Pressable>
        </View>
      </View>
      <View style={{ padding: 16, paddingTop: 8 }}>
        {[['Parking', '$49.50', 'car-outline'], ['HRA', '$200.00', 'heart-outline']].map(([n, v, i]) => (
          <Pressable key={n} onPress={soon} style={[s.card, s.acct, { marginBottom: 8, padding: 16 }]}>
            <Ionicons name={i} size={32} color="#2f3b8f" /><Text style={[s.acctN, { flex: 1 }]}>{n}</Text><Text style={s.acctV}>{v}</Text>
          </Pressable>
        ))}
        <View style={[s.card, { padding: 24, marginTop: 8 }]}>
          <View style={s.hsa}><Text style={{ color: '#fff', ...font('700'), fontSize: 18 }}>HSA</Text></View>
          <Text style={s.promoH}>Important Changes to Your HSA</Text>
          <Text style={s.promoP}>We noticed you recently separated from your employer. Don't worry! You still have access to your HSA funds.</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const More = ({ go, soon }) => (
  <View style={{ flex: 1 }}>
    <Header title="More" />
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <View style={[s.card, { overflow: 'hidden' }]}>
        <Row icon="person-outline" title="Profile" sub="Personal details and security" onPress={soon} />
        <Row icon="document-text-outline" title="My Documents" sub="Receipts, statements and forms" onPress={() => go('docs')} />
        <Row icon="notifications-outline" title="Notifications" sub="Alerts and reminders" onPress={soon} />
        <Row icon="settings-outline" title="Settings" sub="Preferences and accessibility" onPress={soon} />
        <Row icon="help-circle-outline" title="Help & Support" sub="Chat, call or browse FAQs" onPress={soon} />
      </View>
    </ScrollView>
  </View>
);

const Docs = ({ go, back, soon, count }) => (
  <View style={{ flex: 1 }}>
    <Header title="My Documents" onBack={back} />
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text style={s.lead}>Keep your benefit paperwork in one place.</Text>
      <View style={[s.card, { overflow: 'hidden' }]}>
        <Row icon="receipt-outline" title="Saved Receipts" sub={`${count} saved`} onPress={() => go('receipts')} />
        <Row icon="document-outline" title="Statements" sub="Monthly account statements" onPress={soon} />
        <Row icon="newspaper-outline" title="Tax Forms" sub="1099-SA and 5498-SA" onPress={soon} />
        <Row icon="clipboard-outline" title="Claim Documents" sub="Files attached to your claims" onPress={soon} />
      </View>
    </ScrollView>
  </View>
);

const Receipts = ({ back, go, items, newId }) => {
  const { bottom } = useSafeAreaInsets();
  return (
    <View style={{ flex: 1 }}>
      <Header title="Saved Receipts" onBack={back} />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={s.lead}>Saved receipts can be reused when you create a claim, so you only upload them once.</Text>
        <View style={[s.card, { overflow: 'hidden' }]}>
          {items.map((r) => (
            <View key={r.id} style={[s.row, r.id === newId && { backgroundColor: C.tint }]}>
              <View style={s.chip}><Ionicons name="receipt-outline" size={22} color={C.blue} /></View>
              <View style={{ flex: 1 }}>
                <Text style={s.rowT}>{r.m}{r.id === newId && <Text style={s.badge}>  New  </Text>}</Text>
                <Text style={s.rowS}>{r.d}{r.claim ? ` · ${r.claim}` : ''}</Text>
              </View>
              <Text style={s.amt}>{r.a}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
      <View style={[s.foot, { paddingBottom: bottom + 16 }]}><Btn icon="cloud-upload-outline" label="Upload Receipt" onPress={() => go('upload')} /></View>
    </View>
  );
};

const Upload = ({ back, done }) => {
  const [busy, setBusy] = useState(false);
  const w = useRef(new Animated.Value(0)).current;
  const start = () => {
    setBusy(true);
    Animated.timing(w, { toValue: 1, duration: 1400, useNativeDriver: false }).start(({ finished }) => finished && done());
  };
  return (
    <View style={{ flex: 1 }}>
      <Header title="Upload Receipt" onBack={busy ? undefined : back} />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={s.lead}>Add a photo or PDF of your receipt. We'll read the details for you.</Text>
        {!busy ? (
          <View style={s.drop}>
            <View style={s.dropIc}><Ionicons name="cloud-upload-outline" size={28} color={C.blue} /></View>
            <Text style={{ ...font('600'), fontSize: 18, color: C.ink, marginBottom: 4 }}>Add your receipt</Text>
            <Text style={{ color: C.mut, fontSize: 14, marginBottom: 24 }}>JPG, PNG or PDF · up to 10 MB</Text>
            <Btn label="Choose File" onPress={start} />
            <View style={{ height: 8 }} />
            <Btn label="Take Photo" variant="secondary" icon="camera-outline" onPress={start} />
          </View>
        ) : (
          <View style={[s.card, { padding: 16 }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <View style={s.chip}><Ionicons name="document-outline" size={22} color={C.blue} /></View>
              <Text style={{ ...font('600'), color: C.ink }}>doctors-office-receipt.jpg</Text>
            </View>
            <View style={s.prog}><Animated.View style={[s.progF, { width: w.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }) }]} /></View>
            <Text style={{ color: C.mut, fontSize: 14 }}>Uploading and reading receipt…</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const Details = ({ back, save }) => {
  const { bottom } = useSafeAreaInsets();
  const [sheet, setSheet] = useState(false);
  const kv = [['Merchant', "Doctor's Office"], ['Date', 'September 28, 2026'], ['Amount', '$100.00'], ['Category', 'Medical']];
  return (
    <View style={{ flex: 1 }}>
      <Header title="Receipt Details" onBack={back} />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View style={s.prev}><ReceiptPaper /></View>
        <View style={[s.card, { overflow: 'hidden' }]}>
          {kv.map(([k, v], i) => (
            <View key={k} style={[s.kv, i === kv.length - 1 && { borderBottomWidth: 0 }]}><Text style={{ color: C.mut, fontSize: 14 }}>{k}</Text><Text style={{ ...font('600'), color: C.ink, fontSize: 16 }}>{v}</Text></View>
          ))}
        </View>
      </ScrollView>
      <View style={[s.foot, { paddingBottom: bottom + 16 }]}><Btn label="Save Receipt" onPress={() => setSheet(true)} /></View>
      <Modal visible={sheet} transparent animationType="slide" onRequestClose={() => setSheet(false)}>
        <Pressable style={s.scrim} onPress={() => setSheet(false)}>
          <Pressable style={[s.sheet, { paddingBottom: bottom + 16 }]}>
            <Text style={{ ...font('700'), fontSize: 20, color: C.ink }}>Link to a claim?</Text>
            <Text style={{ color: C.mut, fontSize: 15, lineHeight: 22, marginBottom: 8 }}>You can attach this receipt to an existing claim now, or keep it saved for later.</Text>
            <Btn variant="secondary" icon="clipboard-outline" label="Associate with Claim" onPress={() => { setSheet(false); save('Claim #CL-20418'); }} />
            <Btn variant="ghost" label="Skip" onPress={() => { setSheet(false); save(null); }} />
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};

const Success = ({ done, claim }) => {
  const { bottom } = useSafeAreaInsets();
  return (
    <View style={{ flex: 1 }}>
      <View style={s.center}>
        <View style={s.ok}><Ionicons name="checkmark" size={52} color={C.okD} /></View>
        <Text style={{ ...font('700'), fontSize: 28, color: C.ink, marginBottom: 8 }}>Receipt Saved</Text>
        <Text style={{ color: C.mut, fontSize: 16, lineHeight: 24, textAlign: 'center', maxWidth: 290 }}>
          {claim ? `Your receipt has been saved and linked to ${claim.replace('Claim ', 'claim ')}.` : 'Your receipt has been saved and can be used for future claims.'}
        </Text>
      </View>
      <View style={[s.foot, { paddingBottom: bottom + 16 }]}><Btn label="Done" onPress={done} /></View>
    </View>
  );
};

// ---- App shell with simple stack navigation ----
function Root() {
  const [stack, setStack] = useState(['home']);
  const [items, setItems] = useState(INITIAL);
  const [newId, setNewId] = useState(null);
  const [claim, setClaim] = useState(null);
  const [toast, setToast] = useState('');
  const cur = stack[stack.length - 1];

  const go = (k) => {
    if (k === 'home') return setStack(['home']);
    if (k === 'more') return setStack(['home', 'more']);
    if (k === 'upload') setNewId(null);
    setStack((st) => [...st, k]);
  };
  const back = () => { setStack((st) => (st.length > 1 ? st.slice(0, -1) : st)); return stack.length > 1; };
  const soon = () => { setToast('Not part of this prototype'); setTimeout(() => setToast(''), 1800); };

  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => cur !== 'success' && back());
    return () => sub.remove();
  });

  const save = (cl) => {
    const r = { id: String(Date.now()), m: "Doctor's Office", a: '$100.00', d: 'September 28, 2026', claim: cl };
    setItems((i) => [r, ...i]); setNewId(r.id); setClaim(cl);
    setStack(['home', 'more', 'docs', 'receipts', 'success']);
  };

  const showNav = cur === 'home' || cur === 'more';
  return (
    <View style={s.root}>
      <StatusBar style={cur === 'home' ? 'light' : 'dark'} />
      <View style={{ flex: 1 }}>
        {cur === 'home' && <Home soon={soon} />}
        {cur === 'more' && <More go={go} soon={soon} />}
        {cur === 'docs' && <Docs go={go} back={back} soon={soon} count={items.length} />}
        {cur === 'receipts' && <Receipts go={go} back={back} items={items} newId={newId} />}
        {cur === 'upload' && <Upload back={back} done={() => setStack((st) => [...st.slice(0, -1), 'details'])} />}
        {cur === 'details' && <Details back={back} save={save} />}
        {cur === 'success' && <Success claim={claim} done={() => setStack(['home', 'more', 'docs', 'receipts'])} />}
      </View>
      {showNav && <BottomNav active={cur} go={go} soon={soon} />}
      {!!toast && <View style={s.toast} accessibilityLiveRegion="polite"><Text style={{ color: '#fff', fontSize: 14 }}>{toast}</Text></View>}
    </View>
  );
}

export default function App() {
  return <SafeAreaProvider><Root /></SafeAreaProvider>;
}

// ---- Styles ----
const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg, ...(Platform.OS === 'web' ? { maxWidth: 430, width: '100%', alignSelf: 'center' } : null) },
  hero: { backgroundColor: C.navy, paddingHorizontal: 16, paddingBottom: 24 },
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 24 },
  logo: { color: '#fff', fontSize: 32, letterSpacing: -1, ...font('700') },
  avatar: { width: 48, height: 48, borderRadius: 24, borderWidth: 2, borderColor: '#fff', backgroundColor: '#d9967a', alignItems: 'center', justifyContent: 'center' },
  card: { backgroundColor: '#fff', borderWidth: 1, borderColor: C.line, borderRadius: 16, shadowColor: '#111827', shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 1 },
  acct: { flexDirection: 'row', alignItems: 'center', gap: 16, minHeight: 56 },
  acctN: { fontSize: 18, color: C.ink, ...font('400') }, acctV: { fontSize: 18, color: C.ink, ...font('700') },
  invest: { flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1, borderColor: C.line, borderRadius: 12, padding: 12, minHeight: 56, marginTop: 8 },
  hsa: { width: 112, height: 72, borderRadius: 8, backgroundColor: C.green, alignSelf: 'center', alignItems: 'center', justifyContent: 'center', transform: [{ rotate: '-8deg' }] },
  promoH: { fontSize: 24, lineHeight: 30, color: C.ink, marginTop: 16, marginBottom: 8, ...font('700') },
  promoP: { fontSize: 16, lineHeight: 24, color: C.ink },
  nav: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-end', backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: C.line, paddingTop: 8 },
  navI: { minWidth: 64, minHeight: 48, alignItems: 'center', gap: 4 },
  navT: { fontSize: 12, color: C.ink, ...font('500') },
  fab: { width: 56, height: 56, borderRadius: 28, backgroundColor: C.blue, alignItems: 'center', justifyContent: 'center', borderWidth: 4, borderColor: '#fff', shadowColor: C.blue, shadowOpacity: 0.4, shadowRadius: 8, shadowOffset: { width: 0, height: 4 }, elevation: 6 },
  bar: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 8, paddingBottom: 8, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: C.line },
  barT: { fontSize: 20, color: C.ink, ...font('700') },
  ib: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 16, padding: 16, minHeight: 72, borderBottomWidth: 1, borderBottomColor: C.line, backgroundColor: '#fff' },
  rowT: { fontSize: 16, color: C.ink, ...font('600') }, rowS: { fontSize: 14, color: C.mut, marginTop: 2 },
  chip: { width: 40, height: 40, borderRadius: 12, backgroundColor: C.tint, alignItems: 'center', justifyContent: 'center' },
  amt: { fontSize: 16, color: C.ink, ...font('700') },
  badge: { fontSize: 12, color: C.okD, backgroundColor: C.ok, ...font('600') },
  lead: { fontSize: 16, lineHeight: 24, color: C.mut, marginBottom: 16 },
  foot: { padding: 16, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: C.line, gap: 8 },
  btn: { minHeight: 52, borderRadius: 12, paddingHorizontal: 24, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  btnT: { fontSize: 16, ...font('600') },
  drop: { borderWidth: 2, borderStyle: 'dashed', borderColor: '#9db4f5', backgroundColor: C.tint, borderRadius: 16, padding: 24, paddingVertical: 32, alignItems: 'stretch' },
  dropIc: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginBottom: 16 },
  prog: { height: 8, borderRadius: 4, backgroundColor: '#d5e0fb', overflow: 'hidden', marginVertical: 16 },
  progF: { height: 8, backgroundColor: C.blue },
  prev: { backgroundColor: '#e9eef7', borderRadius: 16, padding: 16, marginBottom: 16 },
  paper: { backgroundColor: '#fff', borderWidth: 1, borderColor: C.line, borderRadius: 12, padding: 16, width: 176, alignSelf: 'center', gap: 4 },
  pl: { fontSize: 11, color: '#374151' }, pr: { flexDirection: 'row', justifyContent: 'space-between' },
  dash: { borderTopWidth: 1, borderStyle: 'dashed', borderColor: '#cbd5e1', marginVertical: 4 },
  kv: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, minHeight: 56, borderBottomWidth: 1, borderBottomColor: C.line },
  scrim: { flex: 1, backgroundColor: 'rgba(17,24,39,.5)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 16, paddingTop: 24, gap: 8 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  ok: { width: 96, height: 96, borderRadius: 48, backgroundColor: C.ok, alignItems: 'center', justifyContent: 'center', marginBottom: 24 },
  toast: { position: 'absolute', left: 16, right: 16, bottom: 104, backgroundColor: C.ink, borderRadius: 12, padding: 12, alignItems: 'center' },
});
