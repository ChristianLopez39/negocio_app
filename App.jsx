import React, { useState } from 'react';
import { View, Image, ScrollView, Linking } from 'react-native';
import * as eva from '@eva-design/eva';
import { ApplicationProvider, Button, Text, Icon, IconRegistry, Modal } from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';

const IconEnviar = (props) => <Icon {...props} name="paper-plane-outline" />;
const IconAgregar = (props) => <Icon {...props} name="shopping-cart-outline" />;

const MenuSelection = () => {
  const [orders, setOrders] = useState([]);
  const [numOrders, setNumOrders] = useState(0)
  const [cantidad, setCantidad] = useState(0)

  const addOrder = () => {
    setNumOrders((num) => num + 1)
    setOrders([...orders, {
      food: null,
      package: null,
      flavor: null,
      seasoning: null,
      aderezo: null,
      extras: { potatoes: [], meat: [] },
    }]);
  };

  const removeOrder = (index) => {
    setNumOrders((num) => num - 1)
    setOrders(prevOrders => prevOrders.filter((_, i) => i !== index));
  };

  const updateOrder = (index, category, item) => {
    console.log("info:",item)
    if(item === "Salchi papas"){
      setCantidad(cantidad+60)
    } else if(item === "Solas"){
      setCantidad(cantidad+75)
    }else if(item === "Con papas"){
      setCantidad(cantidad+85)
    }else if(item === "Con papas y agua"){
      setCantidad(cantidad+100)
    }
    setOrders(prevOrders => {
      const updatedOrders = [...prevOrders];
      updatedOrders[index][category] = item;
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

  const generateOrderMessage = () => {
    let message = `Hola, mi orden seria 🍗🍗🍗:\n`;
    orders.forEach((order, i) => {
      message += `\nOrden ${i + 1}:\n`;
      message += `- Comida: ${order.food || 'No seleccionado'}\n`;
      message += `- Paquete: ${order.package || 'No seleccionado'}\n`;
      message += `- Sabor: ${order.flavor || 'No seleccionado'}\n`;
      if (order.package === 'Con papas' || order.package === 'Con papas y agua') {
        message += `- Sazonador de papas: ${order.seasoning || 'No seleccionado'}\n`;
      }
      if (order.extras.potatoes.length > 0) {
        message += `- Extras para papas: ${order.extras.potatoes.join(', ')}\n`;
      }
      if (order.extras.meat.length > 0) {
        message += `- Extras para alitas/costillas: ${order.extras.meat.join(', ')}\n`;
      }
      message += `- Aderezo: ${order.aderezo || 'No seleccionado'}\n`;
      message += `- Cantidad: ${cantidad}\n`;
    });
    return encodeURIComponent(message);
  };

  const sendOrderToWhatsApp = () => {
    //const phoneNumber = '5215535595704';
    const message = generateOrderMessage();
    console.log("mensaje: ", message)
    //const url = `https://wa.me/${phoneNumber}?text=${message}`;
    //Linking.openURL(url);
  };

  return (
    <>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider {...eva} theme={eva.light}>
        <View>
          <ScrollView style={{ padding: 20 }}>
            <View style={{ marginBottom: 20 }}>
              <Text style={{ fontSize: 40, fontWeight: 'bold', marginTop: 20, color: '#FFF', textAlign: 'center', marginBottom: 20 }}>Alitas Mara</Text>
              <View style={{ alignItems: 'center', marginBottom: 25 }}>
                <Image style={{ height: 200, width: 300, borderRadius: 15, borderWidth: 3, borderColor: '#FFF' }} source={require('./Image/Alitas.jpeg')}></Image>
              </View>
              <Button
                onPress={addOrder}
                status='primary'
                accessoryRight={IconAgregar}
              >
                {'Agregar orden ' + numOrders}
              </Button>
            </View>
            {orders.map((order, index) => (
              <View key={index} style={{ backgroundColor: '#FFF', marginBottom: 30, borderWidth: 1, padding: 10, borderRadius: 10, paddingHorizontal: 20 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
                  <Text style={{ fontSize: 20, fontWeight: 'bold', marginTop: 20 }}>Orden {index + 1}:</Text>
                  <Button style={{ backgroundColor: 'red', padding: 5, alignSelf: 'flex-end' }} status='danger' onPress={() => removeOrder(index)}>Eliminar</Button>
                </View>
                <Text style={{ fontSize: 15, fontWeight: 'bold' }}>Comida:</Text>
                {['Alitas al carbón', 'Alitas fritas', 'Costillas al carbón', "Salchi papas"].map(food => (
                  <View style={{ marginHorizontal: 20, marginVertical: 10 }}>
                    <Button status={order.food === food ? 'success' : 'info'} onPress={() => updateOrder(index, 'food', food)}>{food}</Button>
                  </View>
                ))}
                {order.food === 'Alitas al carbón' || order.food === "Alitas fritas" || order.food === "Costillas al carbón" ? (
                  <View>
                    <Text style={{ fontSize: 15, fontWeight: 'bold' }}>Paquete:</Text>
                    {['Solas', 'Con papas', 'Con papas y agua'].map(pkg => (
                      <View style={{ marginHorizontal: 20, marginVertical: 10 }}>
                        <Button status={order.package === pkg ? 'success' : 'info'} onPress={() => updateOrder(index, 'package', pkg)}>{pkg}</Button>
                      </View>
                    ))}
                  </View>
                ) : null}

                <Text style={{ fontSize: 15, fontWeight: 'bold' }}>Sabor:</Text>
                {["Sin nada", 'BBQ', 'Buffalo', 'Mango Habanero', 'Naranja Chipotle', 'Tamarindo', 'Xtra Hot'].map(flavor => (
                  <View style={{ marginHorizontal: 20, marginVertical: 10 }}>
                    <Button status={order.flavor === flavor ? 'success' : 'info'} onPress={() => updateOrder(index, 'flavor', flavor)}>{flavor}</Button>
                  </View>
                ))}
                {order.package === 'Con papas' || order.package === 'Con papas y agua' || order.food === "Salchi papas"? (
                  <View>
                    <Text style={{ fontSize: 15, fontWeight: 'bold' }}>Sazonador:</Text>
                    {
                      ["Sin nada", 'Lemon Pepper', 'Fuego', 'Cajun', 'Cheddar'].map(seasoning => (
                        <View style={{ marginHorizontal: 20, marginVertical: 10 }}>
                          <Button status={order.seasoning === seasoning ? 'success' : 'info'} onPress={() => updateOrder(index, 'seasoning', seasoning)}>{seasoning}</Button>
                        </View>
                      ))
                    }
                  </View>
                ) : null}
                {order.package === 'Con papas' || order.package === 'Con papas y agua' || order.food === "Salchi papas"? (
                  <View>
                    <Text style={{ fontSize: 15, fontWeight: 'bold' }}>Extra papas / Salchi papas:</Text>
                    {['Catsup', 'Salsa', 'Queso'].map(extra => (
                      <View style={{ marginHorizontal: 20, marginVertical: 10 }}>
                        <Button status={order.extras.potatoes.includes(extra) ? 'success' : 'info'} onPress={() => toggleExtra(index, 'potatoes', extra)}>{extra}</Button>
                      </View>
                    ))}
                  </View>
                ) : null}
                {order.food === 'Alitas al carbón' || order.food === "Alitas fritas" || order.food === "Costillas al carbón" ? (
                  <View> 
<Text style={{ fontSize: 15, fontWeight: 'bold' }}>Extra alitas o costillas:</Text>
                {['Salsas Negras', 'Tajín'].map(extra => (
                  <View style={{ marginHorizontal: 20, marginVertical: 10 }}>
                    <Button status={order.extras.meat.includes(extra) ? 'success' : 'info'} onPress={() => toggleExtra(index, 'meat', extra)}>{extra}</Button>
                  </View>
                ))}
                  </View>
                ) : null}
                {order.food === 'Alitas al carbón' || order.food === "Alitas fritas" || order.food === "Costillas al carbón" ? (
                <View>
                <Text style={{ fontSize: 15, fontWeight: 'bold' }}>Aderezo:</Text>
                {['Ranch', 'Blue Cheese'].map(aderezo => (
                  <View style={{ marginHorizontal: 20, marginVertical: 10 }}>
                    <Button status={order.aderezo === aderezo ? 'success' : 'info'} onPress={() => updateOrder(index, 'aderezo', aderezo)}>{aderezo}</Button>
                  </View>
                ))}
                </View>
                ) : null}
              </View>
            ))}
            <View style={{ marginBottom: 50 }}>
              <Button
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
