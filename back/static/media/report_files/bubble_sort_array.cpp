#include <iostream> 

void bubbleSort(int* arr,int lenArr) { 
    for (int i = 0; i < lenArr; i++) { 
        for (int j = 0; j < lenArr - i; j++) { 
            if (*(arr+j) > *(arr+j+1)) { 
                int temp = *(arr+j); 
                *(arr+j) = *(arr+j+1); 
                *(arr+j+1) = temp; 
            } 
        } 
    } 
} 

void correctInputData(int* arr,int lenArr){
    std::cout << "Введите элементы массива: " << std::endl;
    for (int i = 0; i < lenArr; ++i) {
        std::cout << "Элемент " << i + 1 << ": ";
        std::cin >> *(arr+i);

        while (std::cin.fail()) {
            std::cin.clear();
            std::cin.ignore(std::numeric_limits<std::streamsize>::max(), '\n');
            std::cout << "Ошибка! Введите целое число для элемента " << i + 1 << ": ";
            std::cin >> *(arr+i);
        }
    }
}

void outputData(int* arr,int lenArr){
    for (int i = 0; i < lenArr; ++i) { 
        std::cout << *(arr+i) << " "; 
    }
    std::cout << std::endl; 
}

int main() {
    setlocale(LC_ALL, "ru_RU.UTF-8"); 
    int lenArr; 
    std::cout << "Введите количество элементов в массиве: "; 
    std::cin >> lenArr; 

    int* arr = new int[lenArr];  

    correctInputData(arr,lenArr);

    std::cout << "Исходный массив: " ; 
    outputData(arr,lenArr);
    
    bubbleSort(arr,lenArr); 

    std::cout << "Отсортированный массив: "; 
    outputData(arr,lenArr);
    
    delete[] arr; 

    return 0; 
}