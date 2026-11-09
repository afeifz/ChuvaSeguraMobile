import { Tabs } from 'expo-router/js-tabs';
import { Icone } from '@/components/Icone';
import { cores } from '@/theme/tema';

/** Navegação principal: quatro abas, cada uma com ícone e texto. */
export default function LayoutAbas() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: cores.primaria },
        headerTintColor: cores.primariaTexto,
        headerTitleStyle: { fontWeight: '700' },
        tabBarActiveTintColor: cores.primaria,
        tabBarInactiveTintColor: cores.textoSuave,
        tabBarLabelStyle: { fontSize: 13, fontWeight: '600' },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Risco',
          headerTitle: 'ChuvaSegura',
          tabBarAccessibilityLabel: 'Risco de alagamento do meu bairro',
          tabBarIcon: () => <Icone nome="water" tamanho={22} />,
        }}
      />
      <Tabs.Screen
        name="alertas"
        options={{
          title: 'Alertas',
          headerTitle: 'Meus alertas',
          tabBarAccessibilityLabel: 'Meus alertas',
          tabBarIcon: () => <Icone nome="notifications" tamanho={22} />,
        }}
      />
      <Tabs.Screen
        name="ocorrencias"
        options={{
          title: 'Ocorrências',
          headerTitle: 'Ocorrências na minha rua',
          tabBarAccessibilityLabel: 'Ocorrências registradas',
          tabBarIcon: () => <Icone nome="document-text" tamanho={22} />,
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: 'Perfil',
          headerTitle: 'Meu perfil e configurações',
          tabBarAccessibilityLabel: 'Perfil e configurações',
          tabBarIcon: () => <Icone nome="person" tamanho={22} />,
        }}
      />
    </Tabs>
  );
}
