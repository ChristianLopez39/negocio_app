import React, { useState } from 'react';
import { View, Image, ScrollView, Linking } from 'react-native';
import * as eva from '@eva-design/eva';
import { ApplicationProvider, Button, Text, Icon, IconRegistry, Modal, TabView, Tab, TabBar } from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';

const IconEnviar = (props) => <Icon {...props} name="paper-plane-outline" />;
const IconAgregar = (props) => <Icon {...props} name="shopping-cart-outline" />;

const MenuSelection = () => {
  const [orders, setOrders] = useState([]);
  const [numOrders, setNumOrders] = useState(0)
  const [cantidad, setCantidad] = useState(0)
  const [selectedIndex, setSelectedIndex] = useState(0);

  const addOrder = () => {
    setNumOrders((num) => num + 1)
    setOrders([...orders, {
      food: null,
      package: null,
      flavor: null,
      seasoning: null,
      aderezo: null,
      pizza: null, 
      extras: { potatoes: [], meat: [], e_pizza: [], salchicha: []},
      price: 0,
    }]);
  };

  const removeOrder = (index) => {
    setNumOrders((num) => num - 1);
    const orderPrice = orders[index].price || 0;
    setCantidad(prev => prev - orderPrice);
    setOrders(prevOrders => prevOrders.filter((_, i) => i !== index));
  };

  const updateOrder = (index, category, item) => {
    setOrders(prevOrders => {
      const updatedOrders = [...prevOrders];
      updatedOrders[index][category] = item;

      if (category === 'package' || category === 'food') {
        const food = category === 'food' ? item : updatedOrders[index].food;
        const pkg = category === 'package' ? item : updatedOrders[index].package;

        let price = 0;
        if (food === 'Salchi papas') {
          price = 60;
        } else if (pkg === 'Solas') {
          price = 70;
        } else if (pkg === 'Con papas') {
          price = 85;
        } else if (pkg === 'Con papas y agua') {
          price = 100;
        } else if (food === 'Papas solas') {
          price = 40
        }else if (food === 'Salchi pulpos') {
          price = 40
        }

        const prevPrice = updatedOrders[index].price || 0;
        setCantidad(prev => prev - prevPrice + price);

        updatedOrders[index].price = price;
      }
      return updatedOrders;
    });
  };

  const toggleExtra = (index, category, item) => {
    setOrders(prevOrders => {
      const updatedOrders = [...prevOrders];
      const updatedExtras = updatedOrders[index].extras[category].includes(item)
        ? updatedOrders[index].extras[category].filter(i => i !== item)
        : [...updatedOrders[index].extras[category], item];
      updatedOrders[index].extras[category] = updatedExtras;
      return updatedOrders;
    });
  };

  const toggleFlavor = (index, flavor) => {
    setOrders(prevOrders => {
      const updatedOrders = [...prevOrders];
      const currentFlavors = updatedOrders[index].flavor || [];

      if (currentFlavors.includes(flavor)) {
        updatedOrders[index].flavor = currentFlavors.filter(f => f !== flavor);
      } else if (currentFlavors.length < 2) {
        updatedOrders[index].flavor = [...currentFlavors, flavor];
      }

      return updatedOrders;
    });
  };

  const generateOrderMessage = () => {
    let message = `Hola, mi orden seria 🍗🍗🍗:\n`;
    orders.forEach((order, i) => {
      message += `\nOrden ${i + 1}:\n`;
      message += `- Comida: ${order.food || 'No seleccionado'}\n`;
      if (order.package) {
        message += `- Paquete: ${order.package}\n`;
      }
      if (order.pizza){
        message +=`- Sabor pizza: ${order.pizza}\n`;
      }
      if (order.flavor){
        message += `- Sabor: ${order.flavor?.length ? order.flavor.join(' y ') : 'No seleccionado'}\n`;
      }
      if (order.extras.e_pizza.length > 0) {
        message += `- Extras para pizza: ${order.extras.e_pizza.join(', ')}\n`;
      }
      if (order.extras.salchicha.length > 0) {
        message += `- Extras para salchicha: ${order.extras.salchicha.join(', ')}\n`;
      }
      if (order.extras.meat.length > 0) {
        message += `- Extras para alitas: ${order.extras.meat.join(', ')}\n`;
      }
      if (order.seasoning) {
        message += `- Sazonador de papas: ${order.seasoning || 'No seleccionado'}\n`;
      }
      if (order.extras.potatoes.length > 0) {
        message += `- Extras para papas: ${order.extras.potatoes.join(', ')}\n`;
      }
      if (order.aderezo) {
        message += `- Aderezo: ${order.aderezo || 'No seleccionado'}\n`;
      }
    });
    message += `\nCantidad: $${cantidad} `;
    return encodeURIComponent(message);
  };

  const sendOrderToWhatsApp = () => {
    const phoneNumber = '5215535595704';
    const message = generateOrderMessage();
    const url = `https://wa.me/${phoneNumber}?text=${message}`;
    Linking.openURL(url);
    setOrders([])
    setCantidad(0)
    setNumOrders(0)
  };

  return (
    <>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider {...eva} theme={eva.light}>
        <View style={{backgroundColor:"#633974", flex:1}}>
          <ScrollView style={{ padding: 20 }}>
            <View style={{ marginBottom: 20 }}>
              <Text style={{ fontSize: 40, fontWeight: 'bold', marginTop: 20, color: '#aa7dd2', textAlign: 'center', marginBottom: 20}}>Comidas</Text>
              <View style={{ alignItems: 'center', marginBottom: 25 }}>
                <Image style={{ height: 200, width: 300, borderRadius: 15, borderWidth: 3, borderColor: 'purple' }} source={require('./Image/Alitas.jpeg')}></Image>
              </View>
              <Button
                onPress={addOrder}
                status='basic'
                accessoryRight={IconAgregar}
                appearance='outline'
              >
                {'Agregar orden ' + numOrders}
              </Button>
            </View>
            {orders.length > 0 && (
  <TabView
    selectedIndex={selectedIndex}
    onSelect={index => setSelectedIndex(index)}
    style={{ marginBottom: 30}}
    tabBarStyle={{backgroundColor:'#aa7dd2'}}
    indicatorStyle={{
      backgroundColor: "black", 
      height: 4, 
    }}
  >
            {orders.map((order, index) => (
              <Tab  title={`Orden ${index + 1}`} key={index}>
              <View key={index} style={{ backgroundColor: '#aa7dd2', marginBottom: 0, borderWidth: 1, padding: 10, borderRadius: 10, paddingHorizontal: 20, marginTop: 20 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
                  <Text style={{ fontSize: 20, fontWeight: 'bold', marginTop: 20 }}>Orden {index + 1}:</Text>
                  <Button style={{ backgroundColor: 'red', padding: 5, alignSelf: 'flex-end' }} status='danger' onPress={() => removeOrder(index)}>Eliminar</Button>
                </View>
                <Text style={{ fontSize: 15, fontWeight: 'bold' }}>Comida:</Text>
                {['Alitas al carbón', 'Alitas fritas',"Alitas mixtas", 'Pizza', "Salchi papas", "Salchi pulpos", "Papas solas",].map(food => (
                  <View style={{ marginHorizontal: 20, marginVertical: 10 }}>
                    <Button style={{backgroundColor: order.food === food ? "#C70039" : "#633974"}} onPress={() => updateOrder(index, 'food', food)}>{food}</Button>
                  </View>
                ))}
                {order.food === 'Alitas al carbón' || order.food === "Alitas fritas" || order.food === "Alitas mixtas" || order.food === "Pizza" ? (
                  <View>
                    <Text style={{ fontSize: 15, fontWeight: 'bold' }}>Paquete:</Text>
                    {['Solas', 'Con papas', 'Con papas y agua'].map(pkg => (
                      <View style={{ marginHorizontal: 20, marginVertical: 10 }}>
                        <Button style={{backgroundColor:order.package === pkg ? "#C70039" : "#633974"}} onPress={() => updateOrder(index, 'package', pkg)}>{pkg}</Button>
                      </View>
                    ))}
                  </View>
                ) : null}
                {order.food === "Pizza" ? (
                  <View>
                    <Text style={{ fontSize: 15, fontWeight: 'bold' }}>Sabor:</Text>
                    {['Pepperoni', 'Hawaiana'].map(tipopizza => (
                      <View style={{ marginHorizontal: 20, marginVertical: 10 }}>
                        <Button style={{backgroundColor:order.pizza === tipopizza ? "#C70039" : "#633974"}} onPress={() => updateOrder(index, 'pizza', tipopizza)}>{tipopizza}</Button>
                      </View>
                    ))}
                  </View>
                ) : null}
                {order.food === 'Alitas al carbón' || order.food === "Alitas fritas" || order.food === "Alitas mixtas" || order.food === "Salchi papas" || order.food === "Salchi pulpos" || order.food === "Pizza" ? (
                  <View>
                    <Text style={{ fontSize: 15, fontWeight: 'bold' }}>Sabor:</Text>
                    {["Sin nada", 'BBQ', 'Buffalo', 'Mango Habanero', 'Tamarindo', 'Xtra Hot'].map(flavor => (
                      <View key={flavor} style={{ marginHorizontal: 20, marginVertical: 10 }}>
                        <Button
                          style={{backgroundColor:order.flavor?.includes(flavor) ? "#C70039" : "#633974"}}
                          onPress={() => toggleFlavor(index, flavor)}
                        >
                          {flavor}
                        </Button>
                      </View>
                    ))}
                  </View>
                ) : null}
                {order.food === 'Salchi papas' || order.food === "Salchi pulpos" ? (
                  <View>
                    <Text style={{ fontSize: 15, fontWeight: 'bold' }}>Extra para salchichas:</Text>
                    {['Catsup', 'Queso', 'Salsa Valentina', 'Salsa botanera'].map(extra => (
                      <View style={{ marginHorizontal: 20, marginVertical: 10 }}>
                        <Button style={{backgroundColor: order.extras.salchicha.includes(extra) ?  "#C70039" : "#633974"}} onPress={() => toggleExtra(index, 'salchicha', extra)}>{extra}</Button>
                      </View>
                    ))}
                  </View>
                ) : null}
             {order.package === 'Con papas' || order.package === 'Con papas y agua' || order.food === "Salchi papas" || order.food === "Papas solas" ? (
                  <View>
                    <Text style={{ fontSize: 15, fontWeight: 'bold' }}>Sazonador:</Text>
                    {
                      ["Sin nada", 'Lemon Pepper', 'Fuego', 'Cajun', 'Cheddar'].map(seasoning => (
                        <View style={{ marginHorizontal: 20, marginVertical: 10 }}>
                          <Button style={{backgroundColor:order.seasoning === seasoning ? "#C70039" : "#633974"}} onPress={() => updateOrder(index, 'seasoning', seasoning)}>{seasoning}</Button>
                        </View>
                      ))
                    }
                  </View>
                ) : null}
                {order.package === 'Con papas' || order.package === 'Con papas y agua' || order.food === "Salchi papas" || order.food === "Papas solas" ? (
                  <View>
                    <Text style={{ fontSize: 15, fontWeight: 'bold' }}>Extra papas:</Text>
                    {['Catsup', 'Queso', 'Salsa Valentina', 'Salsa botanera'].map(extra => (
                      <View style={{ marginHorizontal: 20, marginVertical: 10 }}>
                        <Button style={{backgroundColor:order.extras.potatoes.includes(extra) ? "#C70039" : "#633974"}} onPress={() => toggleExtra(index, 'potatoes', extra)}>{extra}</Button>
                      </View>
                    ))}
                  </View>
                ) : null}
                {order.food === "Pizza" ? (
                  <View>
                    <Text style={{ fontSize: 15, fontWeight: 'bold' }}>Extra pizza:</Text>
                    {['Catsup', 'Salsa Valentina', 'Salsa botanera'].map(extra => (
                      <View style={{ marginHorizontal: 20, marginVertical: 10 }}>
                        <Button style={{backgroundColor:order.extras.e_pizza.includes(extra) ? "#C70039" : "#633974"}} onPress={() => toggleExtra(index, 'e_pizza', extra)}>{extra}</Button>
                      </View>
                    ))}
                  </View>
                ) : null}
                {order.food === 'Alitas al carbón' || order.food === "Alitas fritas" || order.food === "Alitas mixtas" ? (
                  <View>
                    <Text style={{ fontSize: 15, fontWeight: 'bold' }}>Extra alitas:</Text>
                    {['Salsas Negras', 'Tajín'].map(extra => (
                      <View style={{ marginHorizontal: 20, marginVertical: 10 }}>
                        <Button style={{backgroundColor:order.extras.meat.includes(extra) ? "#C70039" : "#633974"}} onPress={() => toggleExtra(index, 'meat', extra)}>{extra}</Button>
                      </View>
                    ))}
                  </View>
                ) : null}
                {order.package === 'Con papas' || order.package === "Con papas y agua" ? (
                  <View>
                    <Text style={{ fontSize: 15, fontWeight: 'bold' }}>Aderezo:</Text>
                    {['Ranch', 'Blue Cheese'].map(aderezo => (
                      <View style={{ marginHorizontal: 20, marginVertical: 10 }}>
                        <Button style={{backgroundColor:order.aderezo === aderezo ? "#C70039" : "#633974"}} onPress={() => updateOrder(index, 'aderezo', aderezo)}>{aderezo}</Button>
                      </View>
                    ))}
                  </View>
                ) : null}
              </View>
              </Tab>
            ))}
            </TabView>
)}
            <View style={{ marginBottom: 50 }}>
              <Button
                disabled={numOrders === 0 ? true : false}
                onPress={sendOrderToWhatsApp}
                status='success'
                accessoryRight={IconEnviar}
              >
                Enviar pedido por WhatsApp
              </Button>
            </View>
          </ScrollView>
        </View>
      </ApplicationProvider>
    </>
  );
};

export default MenuSelection;
