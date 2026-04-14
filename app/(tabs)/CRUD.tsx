import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
  interpolate,
  interpolateColor,
} from "react-native-reanimated";

import { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  getDocs,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { Alert } from "react-native";

const { width } = Dimensions.get("window");

interface TreeNode {
  id: string;
  name: string;
  children: TreeNode[];
}

export default function HomeScreen() {
  const [parent, setParent] = useState("");
  const [member1, setMember1] = useState("");
  const [member2, setMember2] = useState("");
  const [member3, setMember3] = useState("");
  const [newNodeName, setNewNodeName] = useState("");

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selectedTreeId, setSelectedTreeId] = useState<string | null>(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const treeRef = collection(db, "treeData");

  const [treeData, setTreeData] = useState<TreeNode[]>([]);

  const flatten = (nodes: TreeNode[]): TreeNode[] => {
    return (nodes || []).reduce((acc, node) => {
      return acc.concat(node, flatten(node.children || []));
    }, [] as TreeNode[]);
  };

  const allNodes = treeData.reduce(
    (acc, tree) => {
      return acc.concat(
        { node: tree, rootId: tree.id },
        flatten(tree.children || []).map((n) => ({ node: n, rootId: tree.id })),
      );
    },
    [] as { node: TreeNode; rootId: string }[],
  );

  const handleAddTree = async () => {
    if (!selectedNodeId && !parent)
      return Alert.alert("Error", "Primary Username needed for a new group.");

    const newChildren: TreeNode[] = [];
    if (member1)
      newChildren.push({
        id: Math.random().toString(36).substring(2, 9),
        name: member1,
        children: [],
      });
    if (member2)
      newChildren.push({
        id: Math.random().toString(36).substring(2, 9),
        name: member2,
        children: [],
      });
    if (member3)
      newChildren.push({
        id: Math.random().toString(36).substring(2, 9),
        name: member3,
        children: [],
      });

    try {
      if (!selectedNodeId) {
        await addDoc(treeRef, {
          name: parent,
          children: newChildren,
        });
      } else {
        const treeToUpdate = treeData.find((t) => t.id === selectedTreeId);
        if (treeToUpdate) {
          const newTree = JSON.parse(JSON.stringify(treeToUpdate)) as TreeNode;

          const addChildToNode = (nodes: TreeNode[]): boolean => {
            for (let node of nodes) {
              if (node.id === selectedNodeId) {
                if (!node.children) node.children = [];
                node.children.push(...newChildren);
                return true;
              }
              if (node.children && node.children.length > 0) {
                if (addChildToNode(node.children)) return true;
              }
            }
            return false;
          };

          if (newTree.id === selectedNodeId) {
            if (!newTree.children) newTree.children = [];
            newTree.children.push(...newChildren);
          } else {
            addChildToNode(newTree.children || []);
          }

          const docRef = doc(db, "treeData", selectedTreeId!);
          const { id, ...updateData } = newTree;
          await updateDoc(docRef, updateData);
        }
      }

      setParent("");
      setMember1("");
      setMember2("");
      setMember3("");
      setSelectedNodeId(null);
      setSelectedTreeId(null);
    } catch (error) {
      console.log("Error adding node : ", error);
    }
  };

  const handleDeleteTree = async () => {
    if (!selectedNodeId) {
      Alert.alert("Notice", "Please select a group or node from the dropdown to delete.");
      return;
    }

    Alert.alert(
      "Confirm Deletion",
      selectedNodeId === selectedTreeId 
        ? "Are you sure you want to permanently delete this ENTIRE group and all its children?" 
        : "Are you sure you want to delete this specific node?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: async () => {
            try {
              if (selectedNodeId === selectedTreeId) {
                await deleteDoc(doc(db, "treeData", selectedTreeId!));
              } else {
                const treeToUpdate = treeData.find((t) => t.id === selectedTreeId);
                if (treeToUpdate) {
                  const newTree = JSON.parse(JSON.stringify(treeToUpdate)) as TreeNode;

                  const deleteChildFromNode = (nodes: TreeNode[]): boolean => {
                    for (let i = 0; i < nodes.length; i++) {
                      if (nodes[i].id === selectedNodeId) {
                        nodes.splice(i, 1);
                        return true;
                      }
                      if (nodes[i].children && nodes[i].children.length > 0) {
                        if (deleteChildFromNode(nodes[i].children || [])) return true;
                      }
                    }
                    return false;
                  };

                  deleteChildFromNode(newTree.children || []);

                  const docRef = doc(db, "treeData", selectedTreeId!);
                  const { id, ...updateData } = newTree;
                  await updateDoc(docRef, updateData);
                }
              }

              setSelectedNodeId(null);
              setSelectedTreeId(null);
            } catch (error) {
              console.log("Error deleting node : ", error);
            }
          }
        }
      ]
    );
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(treeRef, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTreeData(data as TreeNode[]);
    });
    return () => unsubscribe();
  }, []);

  const router = useRouter();
  const pulseValue = useSharedValue(0);

  useEffect(() => {
    pulseValue.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 2500, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 2500, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      true,
    );

    formOpacity.value = withTiming(1, { duration: 1000 });
    formTranslateY.value = withTiming(0, {
      duration: 800,
      easing: Easing.out(Easing.back(1)),
    });
  }, []);

  const formOpacity = useSharedValue(0);
  const formTranslateY = useSharedValue(50);

  const animatedFormStyle = useAnimatedStyle(() => ({
    opacity: formOpacity.value,
    transform: [{ translateY: formTranslateY.value }],
  }));

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#0C101A", "#141124", "#0A0B10"]}
        style={StyleSheet.absoluteFillObject}
      />
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        <View style={styles.gridContainer}>
          {Array.from({ length: 20 }).map((_, i) => (
            <View key={`h-${i}`} style={[styles.gridLineH, { top: i * 50 }]} />
          ))}
          {Array.from({ length: 20 }).map((_, i) => (
            <View key={`v-${i}`} style={[styles.gridLineV, { left: i * 50 }]} />
          ))}
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1, width: "100%" }}
      >
        <SafeAreaView style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.headerText}>CRUD OPERATIONS</Text>
            <View style={styles.headerUnderline} />
          </View>
          <ScrollView>
            <Animated.View style={[styles.formContainer, animatedFormStyle]}>
              <Text style={styles.formHeaderText}>Resource Management</Text>

              <View style={styles.form}>
                <View style={styles.inputWrapper}>
                  <Text style={styles.labeltext}>SELECT Target parent</Text>

                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={styles.dropdownHeader}
                    onPress={() => setDropdownVisible(!dropdownVisible)}
                  >
                    <Text
                      style={[
                        styles.dropdownHeaderText,
                        !selectedNodeId && { color: "#8A8D9F" },
                      ]}
                    >
                      {selectedNodeId
                        ? allNodes.find((n) => n.node.id === selectedNodeId)
                            ?.node.name
                        : "SELECT NODE"}
                    </Text>
                    <MaterialCommunityIcons
                      name={dropdownVisible ? "chevron-up" : "chevron-down"}
                      size={24}
                      color="#00E5FF"
                    />
                  </TouchableOpacity>

                  {dropdownVisible && (
                    <View style={styles.dropdownList}>
                      <ScrollView
                        style={{ maxHeight: 180 }}
                        nestedScrollEnabled
                      >
                        <TouchableOpacity
                          style={styles.dropdownItem}
                          onPress={() => {
                            setSelectedNodeId(null);
                            setSelectedTreeId(null);
                            setDropdownVisible(false);
                          }}
                        >
                          <Text
                            style={[
                              styles.dropdownItemText,
                              !selectedNodeId &&
                                styles.dropdownItemSelectedText,
                            ]}
                          >
                            CREATE / DELETE NODE  
                          </Text>
                        </TouchableOpacity>

                        {allNodes.map((item, index) => (
                          <TouchableOpacity
                            key={item.node.id || index}
                            style={styles.dropdownItem}
                            onPress={() => {
                              setSelectedNodeId(item.node.id);
                              setSelectedTreeId(item.rootId);
                              setDropdownVisible(false);
                            }}
                          >
                            <Text
                              style={[
                                styles.dropdownItemText,
                                selectedNodeId === item.node.id &&
                                  styles.dropdownItemSelectedText,
                              ]}
                            >
                              {item.node.name}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>
                  )}
                </View>

                {!selectedNodeId && (
                  <View style={styles.inputWrapper}>
                    <Text style={styles.labeltext}>
                      Primary Username (ROOT)
                    </Text>
                    <View style={styles.inputContainer}>
                      <MaterialCommunityIcons
                        name="account-outline"
                        size={20}
                        color="#00E5FF"
                        style={styles.inputIcon}
                      />
                      <TextInput
                        style={styles.input}
                        placeholder="Enter your username"
                        placeholderTextColor="#6060A0"
                        value={parent}
                        onChangeText={setParent}
                      />
                    </View>
                  </View>
                )}

                <View style={styles.inputWrapper}>
                  <Text style={styles.labeltext}>Child Member 1</Text>
                  <View style={styles.inputContainer}>
                    <MaterialCommunityIcons
                      name="account-child-outline"
                      size={20}
                      color="#00E5FF"
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Enter child name"
                      placeholderTextColor="#6060A0"
                      value={member1}
                      onChangeText={setMember1}
                    />
                  </View>
                </View>

                <View style={styles.inputWrapper}>
                  <Text style={styles.labeltext}>
                    Child Member 2 (Optional)
                  </Text>
                  <View style={styles.inputContainer}>
                    <MaterialCommunityIcons
                      name="account-child-outline"
                      size={20}
                      color="#00E5FF"
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Enter child name"
                      placeholderTextColor="#6060A0"
                      value={member2}
                      onChangeText={setMember2}
                    />
                  </View>
                </View>

                <View style={styles.inputWrapper}>
                  <Text style={styles.labeltext}>
                    Child Member 3 (Optional)
                  </Text>
                  <View style={styles.inputContainer}>
                    <MaterialCommunityIcons
                      name="account-child-outline"
                      size={20}
                      color="#00E5FF"
                      style={styles.inputIcon}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Enter child name"
                      placeholderTextColor="#6060A0"
                      value={member3}
                      onChangeText={setMember3}
                    />
                  </View>
                </View>

                <TouchableOpacity
                  activeOpacity={0.8}
                  style={styles.submitButton}
                  onPress={handleAddTree}
                >
                  <LinearGradient
                    colors={["#00E5FF", "#5E35B1"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.buttonGradient}
                  >
                    <Text style={styles.buttonText}>
                      {selectedNodeId ? "APPEND CHILDREN" : "REGISTER GROUP"}
                    </Text>
                    <MaterialCommunityIcons
                      name={selectedNodeId ? "plus-network" : "account-plus"}
                      size={20}
                      color="#04040A"
                    />
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.8}
                  style={styles.submitButton}
                  onPress={handleDeleteTree}
                >
                  <LinearGradient
                    colors={["#FF0000", "#5E35B1"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.buttonGradient}
                  >
                    <Text style={styles.buttonText}>
                      {!selectedNodeId ? "SELECT TO DELETE" : (selectedNodeId === selectedTreeId ? "DELETE ROOT GROUP" : "DELETE CHILD NODE")}
                    </Text>
                    <MaterialCommunityIcons
                      name={!selectedNodeId ? "cursor-default-click" : (selectedNodeId === selectedTreeId ? "delete-alert" : "minus-network")}
                      size={20}
                      color="#04040A"
                    />
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </Animated.View>

            <Animated.View style={[styles.treeContainer, animatedFormStyle]}>
              <Text style={styles.treeHeaderText}>Tree Data</Text>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={true}
                contentContainerStyle={{
                  paddingHorizontal: 10,
                  paddingBottom: 20,
                }}
              >
                <View style={{ minWidth: "100%", paddingRight: 40 }}>
                  {treeData.map((tree) => {
                    const renderVisualNode = (
                      node: TreeNode,
                      isRoot: boolean = false,
                    ) => (
                      <View
                        key={node.id || Math.random().toString()}
                        style={{ alignItems: "center", marginBottom: 10 }}
                      >
                        <View
                          style={[
                            styles.treeinputContainer,
                            isRoot && {
                              minWidth: 110,
                              borderColor: "rgba(0, 229, 255, 0.4)",
                            },
                          ]}
                        >
                          <Text style={styles.childnode} numberOfLines={1}>
                            {node.name}
                          </Text>
                        </View>

                        {node.children && node.children.length > 0 && (
                          <View style={{ alignItems: "center" }}>
                            <View
                              style={{
                                width: 1,
                                height: 16,
                                backgroundColor: "rgba(0, 229, 255, 0.4)",
                              }}
                            />

                            <View style={styles.treechildren}>
                              {node.children.map((child, index) => {
                                const isFirst = index === 0;
                                const isLast =
                                  index === node.children.length - 1;
                                const isOnly = node.children.length === 1;

                                return (
                                  <View
                                    key={child.id || Math.random().toString()}
                                    style={{
                                      alignItems: "center",
                                      position: "relative",
                                      paddingHorizontal: 8,
                                    }}
                                  >
                                    {!isOnly && (
                                      <View
                                        style={{
                                          position: "absolute",
                                          top: 0,
                                          height: 1,
                                          backgroundColor:
                                            "rgba(0, 229, 255, 0.4)",
                                          left: isFirst ? "50%" : 0,
                                          right: isLast ? "50%" : 0,
                                        }}
                                      />
                                    )}

                                    <View
                                      style={{
                                        width: 1,
                                        height: 16,
                                        backgroundColor:
                                          "rgba(0, 229, 255, 0.4)",
                                      }}
                                    />

                                    {renderVisualNode(child, false)}
                                  </View>
                                );
                              })}
                            </View>
                          </View>
                        )}
                      </View>
                    );

                    return (
                      <View
                        key={tree.id}
                        style={{
                          marginBottom: 40,
                          width: "100%",
                          alignItems: "center",
                        }}
                      >
                        {renderVisualNode(tree, true)}
                      </View>
                    );
                  })}
                </View>
              </ScrollView>
            </Animated.View>
          </ScrollView>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0C101A",
  },
  gridContainer: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.1,
  },
  gridLineH: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: "#FFFFFF",
    opacity: 0.2,
  },
  gridLineV: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: "#FFFFFF",
    opacity: 0.2,
  },
  content: {
    flex: 1,
    paddingHorizontal: 25,
    paddingVertical: 40,
  },
  header: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 40,
  },
  headerText: {
    fontSize: 28,
    fontWeight: "900",
    color: "#00E5FF",
    letterSpacing: 4,
    textTransform: "uppercase",
  },
  headerUnderline: {
    width: 60,
    height: 3,
    backgroundColor: "#FF2D70",
    marginTop: 10,
    borderRadius: 2,
    shadowColor: "#FF2D70",
    shadowRadius: 10,
    shadowOpacity: 0.5,
    elevation: 5,
  },
  formContainer: {
    flex: 1,
    width: "100%",
    backgroundColor: "rgba(20, 17, 36, 0.4)",
    borderRadius: 30,
    padding: 25,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
    overflow: "hidden",
    height: "auto",
  },
  formHeaderText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 30,
    letterSpacing: 1,
  },
  form: {
    width: "100%",
    gap: 25,
  },
  treeContainer: {
    flex: 1,
    width: "100%",
    backgroundColor: "rgba(20, 17, 36, 0.4)",
    borderRadius: 30,
    padding: 25,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
    overflow: "hidden",
    height: "auto",
    marginTop: 60,
  },
  treeHeaderText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 30,
    letterSpacing: 1,
  },
  inputWrapper: {
    width: "100%",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(0, 229, 255, 0.15)",
    height: 58,
    paddingHorizontal: 15,
  },
  treeinputContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(0, 229, 255, 0.15)",
    height: 40,
    paddingHorizontal: 12,
    minWidth: 75,
    maxWidth: 95,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: "100%",
    color: "#FFFFFF",
    fontSize: 16,
  },
  labeltext: {
    fontSize: 11,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    color: "#8A8D9F",
    marginBottom: 10,
    fontWeight: "800",
    paddingLeft: 4,
  },

  treechildren: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "center",
    alignSelf: "center",
  },
  dropdownHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(0, 229, 255, 0.15)",
    height: 58,
    paddingHorizontal: 15,
  },
  dropdownHeaderText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
  dropdownList: {
    marginTop: 5,
    backgroundColor: "rgba(20, 17, 36, 0.98)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(0, 229, 255, 0.3)",
    overflow: "hidden",
  },
  dropdownItem: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.05)",
  },
  dropdownItemText: {
    color: "#8A8D9F",
    fontSize: 15,
  },
  dropdownItemSelectedText: {
    color: "#00E5FF",
    fontWeight: "700",
  },

  childnode: {
    fontSize: 10,
    letterSpacing: 1,
    textTransform: "uppercase",
    color: "#8A8D9F",
    fontWeight: "800",
    alignSelf: "center",
    width: "100%",
    textAlign: "center",
  },
  cancelButton: {
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: "rgba(255, 45, 112, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(255, 45, 112, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
  },
  treeDataGroup: {
    width: "100%",
    marginBottom: 20,
  },
  submitButton: {
    width: "100%",
    height: 60,
    borderRadius: 16,
    overflow: "hidden",
    marginTop: 15,
    shadowColor: "#00E5FF",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
  },
  buttonGradient: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  buttonText: {
    color: "#04040A",
    fontSize: 16,
    fontWeight: "900",
    letterSpacing: 2,
  },
});
