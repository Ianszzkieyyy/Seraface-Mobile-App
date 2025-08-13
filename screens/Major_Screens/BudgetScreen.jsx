import { View, Text, FlatList } from "react-native";
import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import TitleContainer from "../../components/UI_Common/Commons/TitleContainer";
import BudgetContainer from "../../components/Budget_Screen/BudgetContainer";
import RoadmapContainer from "../../components/Budget_Screen/RoadmapContainer";
import ProductItem from "../../components/UI_Common/Commons/ProductItem";
import NextButton from "../../components/UI_Common/Buttons/NextButton";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const BudgetScreen = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();

  // Get recommendations from route params or Redux store
  const routeRecommendations = route.params?.recommendations;
  const sessionId = route.params?.sessionId;
  const reduxRecommendations = useSelector(
    (state) => state.skincare.recommendations
  );

  // Use route params if available, otherwise use Redux store
  const recommendations = routeRecommendations || reduxRecommendations;

  // Calculate default budget from recommendations or use fallback
  const defaultBudget = recommendations?.total_budget
    ? parseFloat(recommendations.total_budget.replace(/[^\d.-]/g, "")) || 800
    : 800;

  const [budget, setBudget] = useState(defaultBudget);
  const [futureProducts, setFutureProducts] = useState([]);

  // Calculate spent amount based on recommended products
  const calculateSpentAmount = () => {
    if (
      recommendations?.products &&
      Object.keys(recommendations.products).length > 0
    ) {
      let total = 0;
      Object.values(recommendations.products).forEach((products) => {
        products.forEach((product) => {
          total += parseFloat(product.price.replace(/[^\d.-]/g, "")) || 0;
        });
      });
      return total;
    }
    return 792; // Fallback to mock value
  };

  const spentAmount = calculateSpentAmount();

  const handleBudgetChange = (newBudget) => {
    setBudget(newBudget);
  };

  // Transform future recommendations into product items format
  useEffect(() => {
    if (
      recommendations?.future_recommendations &&
      recommendations.future_recommendations.length > 0
    ) {
      const transformedFutureProducts = [];

      recommendations.future_recommendations.forEach((item, index) => {
        // Handle if item is an object with category and products
        if (
          typeof item === "object" &&
          item.category &&
          item.products &&
          item.products.length > 0
        ) {
          item.products.forEach((product, productIndex) => {
            transformedFutureProducts.push({
              title:
                product.name || `${item.category} Product ${productIndex + 1}`,
              subtitle:
                item.category.charAt(0).toUpperCase() + item.category.slice(1),
              matchPercentage: 85 + Math.floor(Math.random() * 10), // Random match 85-94%
              description: `Future recommended ${item.category} product for your skin profile`,
              price: parseFloat(product.price?.replace(/[^\d.-]/g, "")) || 0,
              priorityLevel: "Medium",
              image:
                "https://via.placeholder.com/150x150/6B96FF/FFFFFF?text=" +
                encodeURIComponent(
                  (product.name || item.category).substring(0, 10)
                ),
              productData: {
                product_data: {
                  title:
                    product.name ||
                    `${item.category} Product ${productIndex + 1}`,
                  price: product.price || "Price TBD",
                  thumbnail:
                    "https://via.placeholder.com/300x300/6B96FF/FFFFFF?text=" +
                    encodeURIComponent(
                      (product.name || item.category).substring(0, 10)
                    ),
                  rating: 4.0 + Math.random() * 0.5,
                  reviews: Math.floor(Math.random() * 500) + 50,
                  store: "Future Recommendation",
                  product_link: "https://example.com/future-product",
                  detailed_description: `This ${item.category} product is recommended for future purchase based on your skin profile analysis.`,
                  media: [
                    {
                      type: "image",
                      link:
                        "https://via.placeholder.com/400x400/6B96FF/FFFFFF?text=" +
                        encodeURIComponent(
                          (product.name || item.category).substring(0, 15)
                        ),
                    },
                  ],
                },
                recommendation_context: {
                  category: item.category,
                  recommended_price: product.price || "TBD",
                  user_context: {
                    skin_type: ["analyzed"],
                    skin_conditions: ["analyzed"],
                    goals: ["future improvement"],
                  },
                  ai_recommended: true,
                },
              },
            });
          });
        }
        // If it's a string or other type, create a generic product entry
        else if (item) {
          const itemName =
            typeof item === "string"
              ? item
              : item.category
                ? item.category
                : "Future Recommendation";

          transformedFutureProducts.push({
            title: itemName,
            subtitle: "Future Product",
            matchPercentage: 85 + Math.floor(Math.random() * 10),
            description: `Recommended for your future skincare routine`,
            price: 0, // Price unknown for generic recommendations
            priorityLevel: "Low",
            image:
              "https://via.placeholder.com/150x150/6B96FF/FFFFFF?text=" +
              encodeURIComponent(itemName.substring(0, 10)),
            productData: {
              product_data: {
                title: itemName,
                price: "Price TBD",
                thumbnail:
                  "https://via.placeholder.com/300x300/6B96FF/FFFFFF?text=" +
                  encodeURIComponent(itemName.substring(0, 10)),
                rating: 4.0,
                reviews: 0,
                store: "Future Recommendation",
                product_link: "https://example.com/future-product",
                detailed_description: `This product is recommended for future purchase based on your skin profile analysis.`,
                media: [
                  {
                    type: "image",
                    link:
                      "https://via.placeholder.com/400x400/6B96FF/FFFFFF?text=" +
                      encodeURIComponent(itemName.substring(0, 15)),
                  },
                ],
              },
              recommendation_context: {
                category: "future",
                recommended_price: "TBD",
                user_context: {
                  skin_type: ["analyzed"],
                  skin_conditions: ["analyzed"],
                  goals: ["future improvement"],
                },
                ai_recommended: true,
              },
            },
          });
        }
      });

      setFutureProducts(transformedFutureProducts);
    } else {
      // Fallback mock data if no future recommendations are available
      setFutureProducts([
        {
          title: "Future Moisturizer Recommendation",
          subtitle: "Moisturizer",
          matchPercentage: 90,
          description: "Hydrating formula for your skin type",
          price: 399.0,
          priorityLevel: "Medium",
          image:
            "https://via.placeholder.com/150x150/6B96FF/FFFFFF?text=Future+Rec",
          productData: {
            product_data: {
              title: "Future Moisturizer Recommendation",
              price: "₱399.00",
              thumbnail:
                "https://via.placeholder.com/300x300/6B96FF/FFFFFF?text=Future+Rec",
              rating: 4.2,
              reviews: 150,
              store: "Future Recommendation",
              product_link: "https://example.com/future-product",
              detailed_description:
                "This is a recommended future purchase based on your skin profile analysis.",
              media: [
                {
                  type: "image",
                  link: "https://via.placeholder.com/400x400/6B96FF/FFFFFF?text=Future+Rec",
                },
              ],
            },
            recommendation_context: {
              category: "future",
              recommended_price: "TBD",
              user_context: {
                skin_type: ["analyzed"],
                skin_conditions: ["analyzed"],
                goals: ["future improvement"],
              },
              ai_recommended: true,
            },
          },
        },
      ]);
    }
  }, [recommendations]);

  const isUsingBackendData =
    recommendations?.products &&
    Object.keys(recommendations.products).length > 0;

  const ListHeaderComponent = () => (
    <View className="flex-col">
      <TitleContainer
        title={"Budget Planner"}
        description={"Optimize your skincare spending"}
      />

      {/* Budget Information */}
      {/* {recommendations?.total_budget && (
        <View className="bg-primary-50 p-4 rounded-xl mb-4">
          <Text className="text-primary-700 font-medium text-center">
            💰 Total Budget: {recommendations.total_budget}
          </Text>
        </View>
      )} */}

      <BudgetContainer
        budget={budget}
        onBudgetChange={handleBudgetChange}
        spentAmount={spentAmount}
      />

      <RoadmapContainer spentAmount={spentAmount} budget={budget} />

      {/* Allocation Information */}
      {recommendations?.allocation &&
        Object.keys(recommendations.allocation).length > 0 && (
          <View className="bg-white p-4 rounded-xl mb-4 shadow-sm">
            <Text className="text-lg font-bold mb-2">Budget Allocation</Text>
            {Object.entries(recommendations.allocation).map(
              ([category, amount]) => (
                <View key={category} className="flex-row justify-between py-1">
                  <Text className="text-textSecondary capitalize">
                    {category}:
                  </Text>
                  <Text className="text-primary-600 font-medium">
                    {amount}%
                  </Text>
                </View>
              )
            )}
          </View>
        )}

      <View className="flex-col mt-4">
        <Text className="font-bold text-lg">
          Future Product Recommendations
        </Text>
        <Text className="text-textSecondary text-sm mb-4">
          Products to consider for your next purchases
        </Text>
      </View>
    </View>
  );

  const handleNextButtonPressed = () => {
    navigation.navigate("Routine");
  };

  return (
    <View className="flex-1">
      <View className="px-8 py-6 gap-3">
        <FlatList
          data={futureProducts}
          renderItem={({ item }) => <ProductItem {...item} />}
          keyExtractor={(item, index) => `future-product-${index}`}
          ListHeaderComponent={ListHeaderComponent}
          contentContainerStyle={{
            paddingBottom: 100,
          }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View className="py-6 items-center">
              <Text className="text-textSecondary text-center">
                No future product recommendations available at this time.
              </Text>
            </View>
          }
        />
      </View>

      <View
        className="absolute bottom-0 left-0 right-0 w-full"
        style={[{ paddingBottom: Math.max(insets.bottom, 20) }]}
      >
        <View className="px-8 w-full">
          <NextButton
            text="See Your Routine"
            icon="arrow-forward-outline"
            onPress={handleNextButtonPressed}
          />
        </View>
      </View>

      {/* Debug Info */}
      {__DEV__ && (
        <View className="absolute top-20 right-4 bg-black/80 p-2 rounded">
          <Text className="text-white text-xs">
            Backend Data: {isUsingBackendData ? "✅" : "❌"}
          </Text>
          <Text className="text-white text-xs">
            Budget: ₱{budget} (Spent: ₱{spentAmount.toFixed(2)})
          </Text>
          <Text className="text-white text-xs">
            Future Products: {futureProducts.length}
          </Text>
          {sessionId && (
            <Text className="text-white text-xs">
              Session: {sessionId.substring(0, 8)}...
            </Text>
          )}
        </View>
      )}
    </View>
  );
};

export default BudgetScreen;
